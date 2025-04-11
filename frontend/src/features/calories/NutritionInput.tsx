import { Badge, Box, Paper, Tab, Tabs } from "@mui/material";
import useDisplay from "../../hooks/useDisplay";
import { SyntheticEvent, useMemo, useState } from "react";
import { ShoppingBasket } from "@mui/icons-material";
import FoodList from "./food/FoodList";
import { useCurrBasketId } from "./CalorieLog";
import { useSelector } from "react-redux";
import { selectCurrentBasket } from "./basketsSelectors";
import { useNavigate } from "react-router-dom";
import { useGetFoodQuery } from "./food/foodApi";
import { FOOD_CATEGORIES } from "../../utils/types";
import CustomLog from "./CustomLog";
import Basket from "./food/Basket";
import { handleError } from "../../utils/errors";
import Loading from "../../components/Loading";
import useBasketUpdater from "../../hooks/useBasketUpdater";

const a11yProps = (index: number) => ({
	id: `simple-tab-${index}`,
	"aria-controls": `simple-tabpanel-${index}`,
});

interface TabProps {
	children: React.ReactNode;
	value: number;
	index: number;
}

const CustomTabPanel = ({ children, value, index }: TabProps) => {
	return (
		<Box role="tabpanel" hidden={value !== index} className="full-w full-h">
			{value === index && (
				<Box className="full-w full-h" sx={{ overflow: "hidden" }}>
					{children}
				</Box>
			)}
		</Box>
	);
};

const NutritionInput = () => {
	const navigate = useNavigate();
	const { isMobile } = useDisplay();
	const [tabValue, setTabValue] = useState(0);
	const currentBasketId = useCurrBasketId();
	const currBasket = useSelector((state) =>
		selectCurrentBasket(state, currentBasketId)
	);

	const { handleEditBasketItem } = useBasketUpdater();

	const {
		data: foodData,
		isLoading: loadingFood,
		error: errorFood,
	} = useGetFoodQuery();
	const { ingredients = [], meals = [] } = foodData ?? {};

	const filteredIng = useMemo(() => {
		return ingredients.filter((el) => el.source !== FOOD_CATEGORIES.MEALS);
	}, [ingredients]);

	const mealQtyMap = useMemo(() => {
		return Object.fromEntries(currBasket.meals.map((el) => [el.id, el.qty]));
	}, [currBasket.meals]);

	const ingQtyMap = useMemo(() => {
		return Object.fromEntries(
			currBasket.ingredients.map((el) => [el.id, el.qty])
		);
	}, [currBasket.ingredients]);

	const handleChangeTabs = (_e: SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (loadingFood) return <Loading />;
	if (errorFood) {
		console.log(errorFood);
		handleError(`Error loading food.`, errorFood);
	}

	const basketBadge =
		currBasket.custom.length +
		currBasket.ingredients.length +
		currBasket.meals.length;

	return (
		<Box
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
					<Tab label="Meals" {...a11yProps(0)} sx={{ fontSize: "12px" }} />
					<Tab
						label="Ingredients"
						{...a11yProps(1)}
						sx={{ fontSize: "12px" }}
					/>
					<Tab label="Custom" {...a11yProps(2)} sx={{ fontSize: "12px" }} />
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
			<Paper sx={{ flex: 1, height: "100%", minHeight: 0, width: "100%" }}>
				<CustomTabPanel value={tabValue} index={0}>
					{/* Meals */}
					<FoodList
						items={meals}
						qtyMap={mealQtyMap}
						onAddItem={(itemId, qty) =>
							handleEditBasketItem(
								currentBasketId,
								FOOD_CATEGORIES.MEALS,
								itemId,
								qty
							)
						}
						newButton={() => navigate("meals")}
						onItemClick={(id) => navigate(`meals/${id}`)}
					/>
				</CustomTabPanel>
				<CustomTabPanel value={tabValue} index={1}>
					{/* Ingredients */}
					<FoodList
						items={filteredIng}
						qtyMap={ingQtyMap}
						onAddItem={(itemId, qty) =>
							handleEditBasketItem(
								currentBasketId,
								FOOD_CATEGORIES.INGREDIENTS,
								itemId,
								qty
							)
						}
						newButton={() => navigate("ingredients")}
						onItemClick={(id) => navigate(`ingredients/${id}`)}
					/>
				</CustomTabPanel>
				<CustomTabPanel value={tabValue} index={2}>
					{/* Custom Logging */}
					<CustomLog />
				</CustomTabPanel>
				<CustomTabPanel value={tabValue} index={3}>
					{/* Basket */}
					<Basket />
				</CustomTabPanel>
			</Paper>
		</Box>
	);
};

export default NutritionInput;
