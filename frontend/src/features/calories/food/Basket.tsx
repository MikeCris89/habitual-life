import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Chip,
	Paper,
	Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { formatDateToTime } from "../../../utils/timeUtils";
import { selectIngredients, selectMeals } from "./foodSelectors";
import { useGetBasketsQuery } from "./foodApi";
import { useMemo, useState } from "react";
import { selectBasketTotals, selectCurrentBasket } from "../basketsSelectors";
import {
	BuildCircleOutlined,
	DinnerDining,
	EggAltOutlined,
	ShoppingBasket,
} from "@mui/icons-material";
import {
	BasketItems,
	Baskets,
	CustomForm,
	FOOD_CATEGORIES,
	FoodCategory,
	isCustomLog,
} from "../../../utils/types";
import QtyField from "../../../components/QtyField";
import { useCurrBasketId } from "../CalorieLog";
import useBasketUpdater from "../../../hooks/useBasketUpdater";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

interface BasketProps {
	basketId: string;
	item: BasketItems | CustomForm;
	foodCat: FoodCategory;
	title: string;
	calories: number;
}

const BasketData = ({ basket }: { basket: Baskets }) => {
	const allIngredients = useSelector(selectIngredients);
	const allMeals = useSelector(selectMeals);

	if (
		!basket.meals.length &&
		!basket.ingredients.length &&
		!basket.custom.length
	)
		return (
			<Typography variant="body1" sx={{ textAlign: "center" }}>
				No Items
			</Typography>
		);
	return (
		<Box className="flex col gap3 full-w full-h" sx={{ flex: 1 }}>
			{basket.meals.length > 0 &&
				basket.meals.map((mealItem, currMealIndex) => (
					<Box className="full-w" key={mealItem.id}>
						<BasketItem
							basketId={basket.id}
							item={mealItem}
							foodCat={FOOD_CATEGORIES.MEALS}
							title={allMeals[mealItem.id].title}
							calories={allMeals[mealItem.id].calories}
						/>
					</Box>
				))}
			{basket.ingredients.length > 0 &&
				basket.ingredients.map((ingItem, ingItemIndex) => (
					<Box className="full-w" key={ingItem.id}>
						<BasketItem
							basketId={basket.id}
							item={ingItem}
							foodCat={FOOD_CATEGORIES.INGREDIENTS}
							title={allIngredients[ingItem.id].title}
							calories={allIngredients[ingItem.id].calories}
						/>
					</Box>
				))}
			{basket.custom.length > 0 &&
				basket.custom.map((custItem, custItemIndex) => (
					<Box className="full-w" key={custItem.id}>
						<BasketItem
							basketId={basket.id}
							item={custItem}
							foodCat={FOOD_CATEGORIES.CUSTOM}
							title="Quick Add"
							calories={custItem.calories}
						/>
					</Box>
				))}
		</Box>
	);
};

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
		<Paper
			//elevation={2}
			variant="outlined"
			className="flex col gap2"
			sx={{ p: 1 }}
		>
			<Box className="flex-between full-w">
				{foodCat === FOOD_CATEGORIES.MEALS
					? mealChip
					: foodCat === FOOD_CATEGORIES.INGREDIENTS
					? ingChip
					: customChip}
				<Typography variant="subtitle2">{calories}Cal</Typography>
			</Box>
			<Box className="flex-between gap2 full-w">
				<Typography variant="body1">{title}</Typography>

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
		</Paper>
	);
};

const Basket = () => {
	const { data: baskets } = useGetBasketsQuery();
	const currentBasketId = useCurrBasketId();
	const basketsTotals = useSelector(selectBasketTotals);

	const [expanded, setExpanded] = useState<string>(currentBasketId);

	const currBasket = useSelector((state) =>
		selectCurrentBasket(state, currentBasketId)
	);

	const sortedBaskets = useMemo(() => {
		if (!baskets) return [];
		const sorted = [...baskets]
			.filter((b) => b.id !== currentBasketId)
			.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
		return [...sorted, currBasket];
	}, [baskets, currBasket, currentBasketId]);

	const handleChange =
		(basketId: string) => (e: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? basketId : currentBasketId);
		};

	if (!sortedBaskets.some((b) => b.id === expanded))
		setExpanded(currentBasketId);

	return (
		<Box
			className="flex-center col gap2 full-w full-h"
			sx={{ justifyContent: "flex-start", overflow: "auto", p: 1 }}
		>
			{sortedBaskets &&
				sortedBaskets.map((basket, i) => {
					const basketTotal = basketsTotals.basketsTotals.find(
						(el) => el.id === basket.id
					);
					const isCurrBasket = basket.id === currentBasketId;
					return (
						<Accordion
							key={basket.id}
							expanded={expanded === basket.id}
							onChange={handleChange(basket.id)}
							className="full-w"
							sx={{ p: 0 }}
							elevation={2}
						>
							<AccordionSummary
								expandIcon={<GridExpandMoreIcon />}
								aria-controls={`panel${basket.id}bh-content`}
								id={`panel${basket.id}bh-header`}
							>
								<Box className="flex-between gap4 full-w">
									<Box className="flex gap4">
										<ShoppingBasket color={isCurrBasket ? "success" : "info"} />
										<Typography variant="body1">
											{isCurrBasket
												? "Current Basket"
												: formatDateToTime(basket.time)}
										</Typography>
									</Box>
									<Typography variant="subtitle2">
										{basketTotal?.calories}Cal
									</Typography>
								</Box>
							</AccordionSummary>
							<AccordionDetails sx={{ padding: "8px 8px", overflowY: "auto" }}>
								<BasketData basket={basket} />
							</AccordionDetails>
						</Accordion>
					);
				})}
		</Box>
	);
};

export default Basket;
