import {
	Badge,
	Box,
	Button,
	Divider,
	Paper,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import { FOOD_CATEGORIES, MealForm } from "../../utils/types";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import {
	useAddEditIngredientMutation,
	useAddEditMealMutation,
	useGetFoodQuery,
} from "./food/foodApi";
import FoodList from "./food/FoodList";
import IngredientLog, { initIngredient } from "./IngredientLog";
import { useNavigate, useParams } from "react-router-dom";
import LogForm from "./LogForm";
import { useSelector } from "react-redux";
import {
	calcMealTotals,
	selectCalorieHabit,
	selectIngredients,
	selectMeals,
} from "./food/foodSelectors";
import { DinnerDiningOutlined } from "@mui/icons-material";
import Loading from "../../components/Loading";

const initMeal: MealForm = {
	title: "",
	description: "",
	ingredients: [],
	id: "",
};

const initCustomMeal = {
	...initIngredient,
	title: "Quick Add",
	source: FOOD_CATEGORIES.MEALS,
};
interface MealNutritionProps {
	form: MealForm;
	qtyMap: Record<string, number>;
}

const MealNutrition = ({ form, qtyMap }: MealNutritionProps) => {
	const ingredients = useSelector(selectIngredients);
	const calorieHabit = useSelector(selectCalorieHabit);
	const mealTotals = calcMealTotals(form, ingredients);

	return (
		<Paper elevation={2} sx={{ p: 1, width: "100%" }}>
			<Typography variant="subtitle2" sx={{ mb: 1 }}>
				Meal Nutrition Summary
			</Typography>
			<TableContainer className="full-w" sx={{ maxHeight: "150px" }}>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>Calories</TableCell>
							<TableCell align="right">{mealTotals.calories}</TableCell>
							<TableCell align="right">
								{calorieHabit && calorieHabit.total > 0
									? Math.round((mealTotals.calories / calorieHabit.total) * 100)
									: 0}
								%
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{calorieHabit?.macros &&
							calorieHabit.macros.map((mac) => {
								const macTotal =
									mac.total > 0 && mealTotals.macros[mac.id] > 0
										? Math.round((mealTotals.macros[mac.id] / mac.total) * 100)
										: 0;
								return (
									<TableRow key={mac.id}>
										<TableCell>{mac.title}</TableCell>
										<TableCell align="right">
											{mealTotals.macros[mac.id] ?? 0}
											{mac.units}
										</TableCell>
										<TableCell align="right">{macTotal}%</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

const MealLog = () => {
	const { id } = useParams();
	const isEditing = !!id;
	const { data: foodData } = useGetFoodQuery();
	const [addEditMeal] = useAddEditMealMutation();
	const [addEditIng] = useAddEditIngredientMutation();
	const formattedIng = useSelector(selectIngredients);

	const [form, setForm] = useState({ ...initMeal });
	const [newIng, setNewIng] = useState(false);
	const [customForm, setCustomForm] = useState({ ...initCustomMeal });
	const [tab, setTab] = useState(0);

	useEffect(() => {
		if (isEditing) {
			const thisMeal = foodData?.meals.find((el) => el.id === id);
			if (thisMeal) {
				setForm({ ...thisMeal });
			}
		}
	}, [isEditing, foodData, id]);

	const navigate = useNavigate();

	const ingQtyMap = useMemo(
		() => Object.fromEntries(form.ingredients.map((el) => [el.id, el.qty])),
		[form.ingredients]
	);

	const ingList = useMemo(
		() =>
			foodData?.ingredients.filter(
				(ing) => ing.source !== FOOD_CATEGORIES.MEALS
			) ?? [],
		[foodData]
	);

	const mealIngList = useMemo(
		() => form.ingredients.map((ing) => formattedIng[ing.id]),
		[form.ingredients, formattedIng]
	);

	if (isEditing && foodData == null) return <Loading />;

	const handleCancelClose = () => {
		if (newIng) setNewIng(false);
		else navigate(-1);
	};

	const handleChange = (key: string, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const addIngToMeal = (ingId: string, qty: number) => {
		setForm((prev) => {
			const items = prev.ingredients;
			const itemExists = items.find((el) => el.id === ingId);
			if (itemExists) {
				if (qty > 0) {
					return {
						...prev,
						ingredients: items.map((el) =>
							el.id === ingId ? { ...el, qty } : el
						),
					};
				} else {
					return {
						...prev,
						ingredients: items.filter((el) => el.id !== ingId),
					};
				}
			}
			return { ...prev, ingredients: [...items, { id: ingId, qty: 1 }] };
		});
	};

	const handleSubmitCustom = () => {
		const ingId = nanoid();
		addEditIng({ ...customForm, id: ingId });
		addIngToMeal(ingId, 1);

		setCustomForm({ ...initCustomMeal });
		setTab(2);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const mealId = isEditing ? id : nanoid();
		addEditMeal({ ...form, id: mealId });
		navigate(-1);
	};

	return (
		<Box
			className="flex-center col full-w full-h"
			sx={{
				overflow: "hidden",
				alignItems: "flex-start",
			}}
		>
			<Box className="flex full-w" sx={{ justifyContent: "flex-end" }}>
				<Button onClick={() => handleCancelClose()}>
					{newIng ? "cancel" : "close"}
				</Button>
			</Box>
			{newIng && (
				<IngredientLog
					onSubmit={(ingId) => {
						setNewIng(false);
						addIngToMeal(ingId, 1);
					}}
				/>
			)}

			{!newIng && (
				<Box
					className="flex-center col gap2 full-w full-h"
					sx={{ overflow: "hidden", flex: 1 }}
				>
					<MealNutrition form={form} qtyMap={ingQtyMap} />
					{/* Meal List */}
					<Divider />
					<Typography
						variant="subtitle1"
						sx={{ textAlign: "center", width: "100%" }}
					>
						{isEditing ? "Edit Meal" : "New Meal"}
					</Typography>
					<Box
						className="flex-center col gap3 full-w full-h"
						sx={{
							height: "60%",
							minHeight: 0,
							alignSelf: "flex-start",
							justifyContent: "flex-start",
							flex: 1,
						}}
					>
						<form id="meal-form" onSubmit={handleSubmit}>
							<TextField
								label="Title"
								size="small"
								value={form.title}
								onChange={(e) => handleChange("title", e.target.value)}
								sx={{ marginTop: "5px" }}
								fullWidth
								required
							/>

							<TextField
								multiline
								label="Description"
								size="small"
								value={form.description}
								onChange={(e) => handleChange("description", e.target.value)}
								fullWidth
								sx={{ marginTop: "8px" }}
							/>
						</form>
						<Tabs
							value={tab}
							onChange={(_, val) => setTab(val)}
							centered
							sx={{
								width: "100%",
							}}
						>
							<Tab
								label="Ingredients"
								sx={{
									fontSize: "12px",
									"&:hover": {
										backgroundColor: "action.hover",
									},
								}}
							/>
							<Tab
								label="Quick Add"
								sx={{
									fontSize: "12px",
									"&:hover": {
										backgroundColor: "action.hover",
									},
								}}
							/>
							<Tab
								icon={
									<Badge badgeContent={form.ingredients.length} color="success">
										<DinnerDiningOutlined color="primary" />
									</Badge>
								}
								iconPosition="start"
								sx={{
									"&:hover": {
										backgroundColor: "action.hover",
									},
								}}
							/>
						</Tabs>
						{/* Ingredients Tab */}
						{tab === 0 && (
							<Box
								className="flex-center col gap2 full-w full-h"
								sx={{ minHeight: 0 }}
							>
								<FoodList
									items={ingList}
									qtyMap={ingQtyMap}
									onAddItem={(itemId, qty) => addIngToMeal(itemId, qty)}
									newButton={() => setNewIng(true)}
								/>
							</Box>
						)}
						{/* Quick Add Tab */}
						{tab === 1 && (
							<Box className="flex-between col gap2 full-w full-h">
								<LogForm
									calories={customForm.calories}
									macros={customForm.macros}
									handleChangeCalories={(_, value) =>
										setCustomForm((prev) => ({ ...prev, calories: value }))
									}
									handleChangeMacros={(macId, value) =>
										setCustomForm((prev) => ({
											...prev,
											macros: { ...prev.macros, [macId]: value },
										}))
									}
								/>
								<Button variant="contained" onClick={handleSubmitCustom}>
									Add to Meal
								</Button>
							</Box>
						)}
						{/* Meal Tab */}
						{tab === 2 && (
							<FoodList
								items={mealIngList}
								qtyMap={ingQtyMap}
								onAddItem={(itemId, qty) => addIngToMeal(itemId, qty)}
								searchBar={false}
							/>
						)}
					</Box>

					{tab !== 1 && (
						<Button
							type="submit"
							form="meal-form"
							variant="contained"
							fullWidth
							disabled={form.ingredients.length === 0}
						>
							Save Meal
						</Button>
					)}
				</Box>
			)}
		</Box>
	);
};

export default MealLog;
