import { Ingredients } from "../../../utils/types";
import { RootState } from "../../../app/store";
import { Habit } from "../../../utils/types";
import { foodApi } from "./foodApi";
import { createSelector } from "reselect";

export const selectIngredients = createSelector(
	[
		(state: RootState) =>
			foodApi.endpoints.getFood.select(undefined)(state)?.data?.ingredients ??
			[],
	],
	(ingredients) => {
		const data = Object.fromEntries(
			ingredients.map(({ id, ...ing }) => [id, { ...ing }])
		);
		return data;
	}
);

export const selectMeals = createSelector(
	[
		(state: RootState) =>
			foodApi.endpoints.getFood.select(undefined)(state)?.data?.meals ?? [],
		selectIngredients,
	],
	(meals, ingredients) => {
		// { mealId: {macro: value} }
		const formattedMeals: Record<string, Record<string, number | string>> = {};

		for (const meal of meals) {
			const macros: Record<string, number> = {};
			for (const ingId of meal.ingredients) {
				const ing = ingredients[ingId];
				if (!ing) return;
				macros["calories"] = (macros["calories"] || 0) + ing.calories;
				ing.macros.forEach((macro) => {
					macros[macro.title] = (macros[macro.title] || 0) + macro.total;
				});
			}
			formattedMeals[meal.id] = { ...macros };
		}

		return formattedMeals;
	}
);
