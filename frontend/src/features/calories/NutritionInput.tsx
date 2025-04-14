import { Badge, Box, Card, Paper, Tab, Tabs } from "@mui/material";
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
import { motion, AnimatePresence } from "framer-motion";
import { SectionContainer } from "../habits/HabitForm";

const variants = {
	initial: (direction: number) => ({
		x: direction > 0 ? 200 : -200,
		opacity: 0,
	}),
	animate: {
		x: 0,
		opacity: 1,
		transition: { duration: 0.25, ease: "easeInOut" },
	},
	exit: (direction: number) => ({
		x: direction < 0 ? 200 : -200,
		opacity: 0,
		transition: { duration: 0.25, ease: "easeInOut" },
	}),
};

interface TabProps {
	children: React.ReactNode;
	value: number;
	index: number;
	direction: number;
}

const MotionTabPanel = ({ children, value, index, direction }: TabProps) => {
	if (index !== value) return null;
	return (
		<AnimatePresence mode="wait" custom={direction} initial={!!direction}>
			<motion.div
				key={index}
				variants={variants}
				initial="initial"
				animate="animate"
				exit="exit"
				custom={direction}
				className="full-w full-h"
				style={{ overflow: "hidden" }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

const NutritionInput = () => {
	const navigate = useNavigate();
	const { isMobile } = useDisplay();

	const [tabValue, setTabValue] = useState(0);
	const [direction, setDirection] = useState(0);

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
		setDirection(newValue > tabValue ? 1 : -1);
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
					<Tab label="Meals" sx={{ fontSize: "12px" }} />
					<Tab label="Ingredients" sx={{ fontSize: "12px" }} />
					<Tab label="Custom" sx={{ fontSize: "12px" }} />
					<Tab
						label={
							<Badge badgeContent={basketBadge} color="success">
								<ShoppingBasket />
							</Badge>
						}
						sx={{ minWidth: "50px", width: "50px", padding: "0" }}
					/>
				</Tabs>
			</Box>
			{/* <Card sx={{ flex: 1, height: "100%", minHeight: 0, width: "100%" }}> */}
			<SectionContainer fullWidth fullHeight>
				<MotionTabPanel value={tabValue} index={0} direction={direction}>
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
				</MotionTabPanel>
				<MotionTabPanel value={tabValue} index={1} direction={direction}>
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
				</MotionTabPanel>
				<MotionTabPanel value={tabValue} index={2} direction={direction}>
					{/* Custom Logging */}
					<CustomLog />
				</MotionTabPanel>
				<MotionTabPanel value={tabValue} index={3} direction={direction}>
					{/* Basket */}
					<Basket />
				</MotionTabPanel>
			</SectionContainer>
			{/* </Card> */}
		</Box>
	);
};

export default NutritionInput;
