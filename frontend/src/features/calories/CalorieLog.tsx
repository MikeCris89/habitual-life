import { Box } from "@mui/material";
import PageNav from "../../components/PageNav";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useEditTaskMutation, useGetDailyTasksQuery } from "../tasks/tasksApi";
import { isCounterTask, MacrosTask, PresetId } from "../../utils/types";
import { handleError } from "../../utils/errors";
import { useSelector } from "react-redux";
import { selectBasketTotals } from "./basketsSelectors";
import { nanoid } from "nanoid";
import useDisplay from "../../hooks/useDisplay";
import { Outlet } from "react-router-dom";
import NutritionInput from "./NutritionInput";

export const CurrBasketIdContext = createContext<string | undefined>(undefined);

export const useCurrBasketId = () => {
	const value = useContext(CurrBasketIdContext);
	if (value == null) {
		handleError(
			"Current Basket ID is null. useCurrBasketId hook must be used within Calorie Log component."
		);
	}
	return value;
};

// const a11yProps = (index: number) => ({
// 	id: `simple-tab-${index}`,
// 	"aria-controls": `simple-tabpanel-${index}`,
// });

// interface TabProps {
// 	children: React.ReactNode;
// 	value: number;
// 	index: number;
// }

// const CustomTabPanel = ({ children, value, index }: TabProps) => {
// 	return (
// 		<Box role="tabpanel" hidden={value !== index} className="full-w full-h">
// 			{value === index && (
// 				<Box className="full-w full-h" sx={{ overflow: "hidden" }}>
// 					{children}
// 				</Box>
// 			)}
// 		</Box>
// 	);
// };

interface CalorieProps {
	children: React.ReactNode;
}

const CalorieLog = ({ children }: CalorieProps) => {
	const currentBasketId = useMemo(() => nanoid(), []);
	//	const navigate = useNavigate();

	//subscribe to queries
	// const {
	// 	data: allBaskets,
	// 	isLoading: loadingBaskets,
	// 	error: errorBaskets,
	// } = useGetBasketsQuery();
	// const {
	// 	data: foodData,
	// 	isLoading: loadingFood,
	// 	error: errorFood,
	// } = useGetFoodQuery();
	// const { ingredients = [], meals = [] } = foodData ?? {};

	const { allBasketsTotal } = useSelector(selectBasketTotals);
	// const currBasket = useSelector((state) =>
	// 	selectCurrentBasket(state, currentBasketId)
	// );

	const [editTask] = useEditTaskMutation();
	//const [addBasket] = useAddBasketMutation();

	const { data: task } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [], isLoading }) => {
			const result = data.find((el) => el.habitId === PresetId.calorieCounter);
			if (result && !isCounterTask(result)) {
				handleError("Calorie task is not counter.");
			}
			return { data: result, isLoading };
		},
	});

	const { isMobile } = useDisplay();

	//const [tabValue, setTabValue] = useState(0);

	useEffect(() => {
		if (!task || !task.macros || !allBasketsTotal) return;

		const caloriesChanged = task.count !== allBasketsTotal.calories;
		const macrosChanged = task.macros.some(
			(mac) => mac.count !== allBasketsTotal.macros[mac.id]
		);

		if (caloriesChanged || macrosChanged) {
			console.log(allBasketsTotal);
			editTask({
				...task,
				count: allBasketsTotal.calories,
				macros: task.macros?.map((mac: MacrosTask) => {
					const newMacAmount = allBasketsTotal.macros[mac.id];
					if (newMacAmount == null)
						handleError(`Cannot find macro element in macros state. ${mac.id}`);

					return {
						...mac,
						count: newMacAmount,
					};
				}),
				complete: allBasketsTotal.calories > task.total ? false : true,
			});
		}
	}, [allBasketsTotal, task, editTask]);

	// if (loadingFood || loadingBaskets || loadingTask) return <Loading />;
	// if (errorFood || errorBaskets) {
	// 	console.log(errorFood);
	// 	handleError(`Error loading food.`, errorFood);
	// }

	// const handleChangeTabs = (_e: SyntheticEvent, newValue: number) => {
	// 	setTabValue(newValue);
	// };

	// const handleEditBasketItem = (
	// 	basketId: string,
	// 	foodCat: Exclude<FoodCategory, "custom">,
	// 	itemId: string,
	// 	qty: number
	// ) => {
	// 	const thisBasket =
	// 		basketId === currentBasketId
	// 			? currBasket
	// 			: allBaskets?.find((bask) => bask.id === basketId);

	// 	if (!thisBasket) handleError("Basket not found");

	// 	const itemExists = thisBasket[foodCat].find((el) => el.id === itemId);
	// 	let newBasket: Baskets;
	// 	if (itemExists) {
	// 		newBasket = {
	// 			...thisBasket,
	// 			[foodCat]:
	// 				qty > 0
	// 					? currBasket[foodCat].map((item) =>
	// 							item.id === itemId ? { ...item, qty } : item
	// 					  )
	// 					: currBasket[foodCat].filter((item) => item.id !== itemId),
	// 		};
	// 	} else {
	// 		newBasket = {
	// 			...thisBasket,
	// 			[foodCat]: [...thisBasket[foodCat], { id: itemId, qty: 1 }],
	// 		};
	// 	}
	// 	addBasket(newBasket);
	// };

	// const basketBadge =
	// 	currBasket.custom.length +
	// 	currBasket.ingredients.length +
	// 	currBasket.meals.length;

	return (
		<Box
			className="flex-between col gap2 full-w full-h"
			sx={{
				p: 1,
				overflow: "hidden",

				"& >*": { width: "100%" },
			}}
		>
			<CurrBasketIdContext.Provider value={currentBasketId}>
				<PageNav back={true} title="Calorie Counter" />

				<Outlet />

				<Box
					className="flex-center gap2 full-h full-w"
					sx={{
						flexDirection: isMobile ? "column" : "row",
					}}
				>
					{/* Current Calorie/Macros Count - NutritionDisplay.tsx */}
					{children}

					{/* Calorie Input */}
					{/* <Box
						className="flex-center col full-w"
						sx={{
							flex: 1,
							overflow: "hidden",
							height: isMobile ? "60%" : "100%",
							alignSelf: "flex-start",
						}}
					>
						<Box
							sx={{
								width: "100%",
								borderBottom: 1,
								borderColor: "divider",
								justifyContent: "center",
							}}
						>
							<Tabs
								value={tabValue}
								onChange={handleChangeTabs}
								aria-label="basic tabs example"
								centered
							>
								<Tab
									label="Meals"
									{...a11yProps(0)}
									sx={{ fontSize: "12px" }}
								/>
								<Tab
									label="Ingredients"
									{...a11yProps(1)}
									sx={{ fontSize: "12px" }}
								/>
								<Tab
									label="Custom"
									{...a11yProps(2)}
									sx={{ fontSize: "12px" }}
								/>
								<Tab
									label={
										<Badge badgeContent={basketBadge} color="success">
											<ShoppingBasket />
										</Badge>
									}
									{...a11yProps(3)}
									sx={{ minWidth: "50px", width: "50px", padding: "0" }}
								/>
							</Tabs>
						</Box>
						<Paper
							sx={{ flex: 1, height: "100%", minHeight: 0, width: "100%" }}
						>
							<CustomTabPanel value={tabValue} index={0}>
							
								<FoodList
									items={meals}
									qtyMap={Object.fromEntries(
										currBasket.meals.map((el) => [el.id, el.qty])
									)}
									onAddItem={(itemId, qty) =>
										handleEditBasketItem(
											currentBasketId,
											FOOD_CATEGORIES.MEALS,
											itemId,
											qty
										)
									}
									newButton={() => navigate("new_meals")}
								/>
							</CustomTabPanel>
							<CustomTabPanel value={tabValue} index={1}>
							
								<FoodList
									items={ingredients.filter(
										(el) => el.source !== FOOD_CATEGORIES.MEALS
									)}
									qtyMap={Object.fromEntries(
										currBasket.ingredients.map((el) => [el.id, el.qty])
									)}
									onAddItem={(itemId, qty) =>
										handleEditBasketItem(
											currentBasketId,
											FOOD_CATEGORIES.INGREDIENTS,
											itemId,
											qty
										)
									}
									newButton={() => navigate("new_ingredients")}
								/>
							</CustomTabPanel>
							<CustomTabPanel value={tabValue} index={2}>
							
								<CustomLog currentBasketId={currentBasketId} />
							</CustomTabPanel>
							<CustomTabPanel value={tabValue} index={3}>
							
								<Basket currentBasketId={currentBasketId} />
							</CustomTabPanel>
						</Paper>
					</Box> */}
					<NutritionInput />
				</Box>
			</CurrBasketIdContext.Provider>
		</Box>
	);
};

export default CalorieLog;
