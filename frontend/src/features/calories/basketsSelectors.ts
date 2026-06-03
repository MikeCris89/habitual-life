import { createSelector } from "reselect";
import {
	FormattedIng,
	FormattedMeals,
	selectCalorieHabit,
	selectIngredients,
	selectMeals,
} from "./food/foodSelectors";
import { Baskets } from "../../utils/types";
import { foodApi } from "./food/foodApi";

interface Totals {
	calories: number;
	macros: Record<string, number>;
}

interface BasketTotals {
	calories: number;
	macros: Record<string, number>;
	id: string;
}

const EMPTY_ARR: Baskets[] = [];

export const calcBasketTotals = (
	basket: Baskets,
	ingredients: FormattedIng,
	meals: FormattedMeals
) => {
	const totals: BasketTotals = { calories: 0, macros: {}, id: basket.id };

	for (const { id: ingId, qty } of basket.ingredients) {
		if (ingredients[ingId]) {
			totals.calories += ingredients[ingId].calories * qty;
			for (const [macId, macTotal] of Object.entries(
				ingredients[ingId].macros
			)) {
				totals.macros[macId] = (totals.macros[macId] ?? 0) + macTotal * qty;
			}
		}
	}
	for (const { id: mealId, qty } of basket.meals) {
		if (meals[mealId]) {
			totals.calories += meals[mealId].calories * qty;
			for (const [macId, macTotal] of Object.entries(meals[mealId].macros)) {
				totals.macros[macId] = (totals.macros[macId] ?? 0) + macTotal * qty;
			}
		}
	}
	for (const cust of basket.custom) {
		totals.calories += cust.calories;
		for (const [macId, macTotal] of Object.entries(cust.macros)) {
			totals.macros[macId] = (totals.macros[macId] ?? 0) + macTotal;
		}
	}

	return totals;
};

export const selectBasketTotals = createSelector(
	[
		(state) =>
			foodApi.endpoints.getBaskets.select(undefined)(state)?.data ?? EMPTY_ARR,
		selectIngredients,
		selectMeals,
		selectCalorieHabit,
	],
	(baskets, ingredients, meals, calorieHabit) => {
		// Total Nutrional values for the saved basket
		const basketsTotals: BasketTotals[] = [];
		const allBasketsTotal = baskets.reduce<Totals>(
			(acc, basket) => {
				const basketTotals = calcBasketTotals(basket, ingredients, meals);
				basketsTotals.push(basketTotals);
				acc.calories += basketTotals.calories;
				for (const [macId, macTotal] of Object.entries(basketTotals.macros)) {
					acc.macros[macId] += macTotal;
				}
				return acc;
			},
			{
				calories: 0,
				macros:
					Object.fromEntries(
						calorieHabit?.macros?.map((mac) => [mac.id, 0]) ?? []
					) ?? {},
			}
		);
		return { basketsTotals, allBasketsTotal };
	}
);

export const selectCurrentBasket = createSelector(
	[
		(state) =>
			foodApi.endpoints.getBaskets.select(undefined)(state)?.data ?? EMPTY_ARR,
		(_, currentBasketId) => currentBasketId,
	],
	(baskets, currId) => {
		const currBasket = baskets.find((el) => el.id === currId);
		if (!currBasket) {
			const newCurrBasket: Baskets = {
				time: new Date().toISOString(),
				ingredients: [],
				meals: [],
				custom: [],
				id: currId,
			};
			return newCurrBasket;
		}
		return currBasket;
	}
);
