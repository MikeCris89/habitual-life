import { Box, Chip, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { formatDateToTime } from "../../../utils/timeUtils";
import { selectIngredients, selectMeals } from "./foodSelectors";
import { useGetBasketsQuery } from "./foodApi";
import { useMemo } from "react";
import { selectBasketTotals, selectCurrentBasket } from "../basketsSelectors";
import {
	BuildCircleOutlined,
	DinnerDining,
	EggAltOutlined,
	ShoppingBasket,
} from "@mui/icons-material";
import {
	BasketItems,
	CustomForm,
	FOOD_CATEGORIES,
	FoodCategory,
	isCustomLog,
} from "../../../utils/types";
import QtyField from "../../../components/QtyField";
import { useCurrBasketId } from "../CalorieLog";
import useBasketUpdater from "../../../hooks/useBasketUpdater";

interface BasketProps {
	basketId: string;
	item: BasketItems | CustomForm;
	foodCat: FoodCategory;
	title: string;
	calories: number;
}

const BasketItem = ({
	basketId,
	item,
	foodCat,
	title,
	calories,
}: BasketProps) => {
	const { handleEditBasketItem, handleEditCustomItem } = useBasketUpdater();
	const mealChip = (
		<Chip
			icon={<DinnerDining />}
			label="meal"
			size="small"
			variant="outlined"
			color="primary"
		/>
	);
	const ingChip = (
		<Chip
			icon={<EggAltOutlined />}
			label="ingredient"
			size="small"
			variant="outlined"
			color="secondary"
		/>
	);
	const customChip = (
		<Chip
			icon={<BuildCircleOutlined />}
			label="custom"
			size="small"
			variant="outlined"
			color="default"
		/>
	);

	return (
		<Box className="flex-between gap2 full-w">
			<Box className="flex gap2">
				{foodCat === FOOD_CATEGORIES.MEALS
					? mealChip
					: foodCat === FOOD_CATEGORIES.INGREDIENTS
					? ingChip
					: customChip}
				<Typography variant="body1">{title}</Typography>
			</Box>
			<Typography variant="subtitle2">{calories}Cal</Typography>
			<QtyField
				value={item.qty}
				onChange={(value) => {
					if (foodCat === FOOD_CATEGORIES.CUSTOM && isCustomLog(item)) {
						handleEditCustomItem(basketId, item, value);
					} else if (foodCat !== FOOD_CATEGORIES.CUSTOM) {
						handleEditBasketItem(basketId, foodCat, item.id, value);
					}
				}}
				deleteBtn
			/>
		</Box>
	);
};

const Basket = () => {
	const { data: baskets } = useGetBasketsQuery();
	const currentBasketId = useCurrBasketId();
	const basketsTotals = useSelector(selectBasketTotals);

	const allIngredients = useSelector(selectIngredients);
	const allMeals = useSelector(selectMeals);

	const currBasket = useSelector((state) =>
		selectCurrentBasket(state, currentBasketId)
	);

	const sortedBaskets = useMemo(() => {
		if (!baskets) return [];
		return [...baskets.filter((basket) => basket.id !== currBasket?.id)].sort(
			(a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
		);
	}, [baskets, currBasket]);
	return (
		<Box className="flex-center col gap2 full-w full-h" sx={{ p: 1 }}>
			{sortedBaskets &&
				sortedBaskets.map((basket) => {
					const basketTotal = basketsTotals.basketsTotals.find(
						(el) => el.id === basket.id
					);
					return (
						<Box className="flex-between gap4 full-w" key={basket.id}>
							<Box className="flex gap4">
								<ShoppingBasket />
								<Typography variant="body1">
									{formatDateToTime(basket.time)}
								</Typography>
							</Box>
							<Typography variant="subtitle2">
								{basketTotal?.calories}Cal
							</Typography>
						</Box>
					);
				})}
			<Box className="flex gap2 full-w" sx={{ p: 1 }}>
				<ShoppingBasket color="success" />
				<Typography variant="subtitle1" className="full-w">
					Current Basket
				</Typography>
				<Typography variant="body1">
					{basketsTotals.basketsTotals.find((el) => el.id === currentBasketId)
						?.calories ?? 0}
					Cal
				</Typography>
			</Box>
			<Paper
				elevation={3}
				className="flex col gap3 full-w full-h"
				sx={{ p: 1, flex: 1 }}
			>
				{currBasket.meals.length > 0 &&
					currBasket.meals.map((mealItem, currMealIndex) => (
						<Box className="full-w" key={`${mealItem.id}-${currMealIndex}`}>
							{/* {basketItem(
								mealItem,
								FOOD_CATEGORIES.MEALS,
								allMeals[mealItem.id].title,
								allMeals[mealItem.id].calories
							)} */}
							<BasketItem
								basketId={currentBasketId}
								item={mealItem}
								foodCat={FOOD_CATEGORIES.MEALS}
								title={allMeals[mealItem.id].title}
								calories={allMeals[mealItem.id].calories}
							/>
						</Box>
					))}
				{currBasket.ingredients.length > 0 &&
					currBasket.ingredients.map((ingItem, ingItemIndex) => (
						<Box className="full-w" key={`${ingItem.id}-${ingItemIndex}`}>
							{/* {basketItem(
								ingItem,
								FOOD_CATEGORIES.INGREDIENTS,
								allIngredients[ingItem.id].title,
								allIngredients[ingItem.id].calories
							)} */}
							<BasketItem
								basketId={currentBasketId}
								item={ingItem}
								foodCat={FOOD_CATEGORIES.INGREDIENTS}
								title={allIngredients[ingItem.id].title}
								calories={allIngredients[ingItem.id].calories}
							/>
						</Box>
					))}
				{currBasket.custom.length > 0 &&
					currBasket.custom.map((custItem, custItemIndex) => (
						<Box className="full-w" key={`${custItem.id}-${custItemIndex}`}>
							{/* {basketItem(
								custItem,
								FOOD_CATEGORIES.CUSTOM,
								"Quick Add",
								custItem.calories
							)} */}
							<BasketItem
								basketId={currentBasketId}
								item={custItem}
								foodCat={FOOD_CATEGORIES.CUSTOM}
								title="Quick Add"
								calories={custItem.calories}
							/>
						</Box>
					))}
			</Paper>
		</Box>
	);
	/*
	return (
		<Box sx={{ width: "100%", height: "100%", "& >*": { width: "100%" } }}>
			<Typography variant="body1">Baskets Today</Typography>
			{sortedBaskets && (
				<Box>
					<Box>
						{sortedBaskets.map((basket, i) => {
							return (
								<Box key={`${basket.time}-${i}`}>
									<Typography>{formatDateToTime(basket.time)}</Typography>
									{basket.meals.length > 0 &&
										basket.meals.map(
											({ id: mealId, qty: mealQty }, mealIndex) => (
												<Box
													className="flex gap2"
													key={`${mealId}-${basket.time}-${mealIndex}-${i}`}
												>
													<Chip
														icon={<DinnerDining />}
														label="meal"
														size="small"
														variant="outlined"
														color="primary"
													/>

													<Typography variant="body1">
														{allMeals[mealId].title}:{" "}
														{allMeals[mealId].calories}
														Cal
													</Typography>
												</Box>
											)
										)}
									{basket.ingredients.length > 0 &&
										basket.ingredients.map(({ id: ingId }, ingIndex) => (
											<Box
												className="flex gap2"
												key={`${ingId}-${basket.time}-${ingIndex}-${i}`}
											>
												<Chip
													icon={<EggAltOutlined />}
													label="ingredient"
													size="small"
													variant="outlined"
													color="secondary"
												/>

												<Typography variant="body1">
													{allIngredients[ingId].title}:{" "}
													{allIngredients[ingId].calories}Cal
												</Typography>
											</Box>
										))}
									{basket.custom.length > 0 &&
										basket.custom.map((cust, custIndex) => (
											<Box
												className="flex gap2"
												key={`${cust.calories}-${basket.time}-${custIndex}-${i}`}
											>
												<Chip
													icon={<BuildCircleOutlined />}
													label="custom"
													size="small"
													variant="outlined"
													color="default"
												/>
												<Typography variant="body1">
													Custom: {cust.calories}Cal
												</Typography>
											</Box>
										))}
								</Box>
							);
						})}
					</Box>
					<Box>
						{currBasket && (
							<Box>
								<Typography variant="h6">Current Basket</Typography>
								{currBasket.meals.length > 0 &&
									currBasket.meals.map(
										({ id: currMealId, qty: currMealQty }, currMealIndex) => (
											<Box
												key={`${currBasket.time}-${currMealId}-${currMealIndex}`}
											>
												{allMeals[currMealId].title}:{" "}
												{allMeals[currMealId].calories}Cal
											</Box>
										)
									)}
								{currBasket.ingredients.length > 0 &&
									currBasket.ingredients.map(
										({ id: currIngId }, currIngIndex) => (
											<Box
												key={`${currBasket.time}-${currIngId}-${currIngIndex}`}
											>
												{allIngredients[currIngId].title}:{" "}
												{allIngredients[currIngId].calories}Cal
											</Box>
										)
									)}
								{currBasket.custom.length > 0 &&
									currBasket.custom.map((currCust, currCustIndex) => (
										<Box
											key={`${currBasket.time}-${currCust.calories}-${currCustIndex}`}
										>
											Custom: {currCust.calories}Cal
										</Box>
									))}
							</Box>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
	*/
};

export default Basket;
