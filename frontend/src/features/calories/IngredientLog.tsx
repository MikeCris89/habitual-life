import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import {
	FOOD_CATEGORIES,
	FoodCategory,
	IngredientForm,
	Units,
	UnitTypes,
} from "../../utils/types";
import { useEffect, useState } from "react";
import LogForm from "./LogForm";
import { useAddEditIngredientMutation } from "./food/foodApi";
import NumberField from "../../components/NumberField";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIngredients } from "./food/foodSelectors";
import Loading from "../../components/Loading";
import { SectionContainer } from "../habits/HabitForm";
import PageWrapper from "../../components/PageWrapper";

interface Props {
	source?: Exclude<FoodCategory, "custom">;
	onSubmit?: (ingId: string) => void;
}

export const initIngredient: IngredientForm = {
	title: "",
	description: "",
	servingSize: { serving: 1, units: "unit" },
	source: FOOD_CATEGORIES.INGREDIENTS,
	calories: 0,
	macros: {},
	id: "",
};

const IngredientLog = ({
	source = FOOD_CATEGORIES.INGREDIENTS,
	onSubmit,
}: Props) => {
	const { id } = useParams();
	const isEditing = !!id;
	const ingredients = useSelector(selectIngredients);

	const [form, setForm] = useState<IngredientForm>({
		...initIngredient,
		source,
	});
	const [addEditIng] = useAddEditIngredientMutation();

	useEffect(() => {
		if (isEditing && ingredients[id]) {
			setForm({ ...ingredients[id] });
		}
	}, [id, isEditing, ingredients]);

	if (isEditing && !ingredients[id]) return <Loading />;

	const handleChange = (key: string, value: any) => {
		setForm((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleChangeMacros = (id: string, value: number) => {
		setForm((prev) => ({
			...prev,
			macros: { ...prev.macros, [id]: value },
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const ingId = isEditing ? id : nanoid();
		addEditIng({ ...form, id: ingId });
		setForm({ ...initIngredient, source });
		if (onSubmit) onSubmit(ingId);
	};

	return (
		<Box
			className="flex-between col gap3 full-w full-h"
			sx={{
				overflow: "hidden",
			}}
		>
			<PageWrapper>
				<SectionContainer
					title={isEditing ? "Edit Ingredient" : "New Ingredient"}
					fullWidth
				>
					<form
						className="flex-center col full-w gap3"
						id="ing-form"
						onSubmit={handleSubmit}
					>
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
						/>
					</form>
				</SectionContainer>
				<SectionContainer title="Serving" fullWidth>
					<Box className="flex-around" sx={{ width: "100%" }}>
						<NumberField
							handleChange={(value) =>
								setForm((prev) => ({
									...prev,
									servingSize: { ...prev.servingSize, serving: value },
								}))
							}
							value={form.servingSize.serving}
							min={0}
							max={9999}
							acceptDecimals={true}
						/>

						<FormControl>
							<InputLabel id="select-units-label">Units</InputLabel>
							<Select
								labelId="select-units-label"
								id="select-units"
								value={form.servingSize.units}
								label="Units"
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										servingSize: {
											...prev.servingSize,
											units: e.target.value as UnitTypes,
										},
									}))
								}
								size="small"
							>
								{Units.map((unit, i) => (
									<MenuItem value={unit} key={`${unit}-${i}`}>
										{unit}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</SectionContainer>
				<SectionContainer title="Nutrition" fullWidth>
					<LogForm
						handleChangeCalories={handleChange}
						handleChangeMacros={handleChangeMacros}
						calories={form.calories}
						macros={form.macros}
					/>
				</SectionContainer>
			</PageWrapper>
			<Button variant="contained" type="submit" form="ing-form" fullWidth>
				Submit
			</Button>
		</Box>
	);
};

export default IngredientLog;
