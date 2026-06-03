import { RootState } from "../../../app/store";
import {
	IngredientForm,
	isCounterHabit,
	MealForm,
	PresetId,
} from "../../../utils/types";
import { habitsApi } from "../../habits/habitsApi";
import { foodApi } from "./foodApi";
import { createSelector } from "reselect";

const EMPTY_ING: IngredientForm[] = [];
const EMPTY_MEALS: MealForm[] = [];

export type FormattedMeals = Record<
	string,
	{
		title: string;
		description: string;
		calories: number;
		macros: Record<string, number>;
		ingredients: Record<string, number>;
		id: string;
	}
>;

export type FormattedIng = Record<string, IngredientForm>;

export const calcMealTotals = (meal: MealForm, ingredients: FormattedIng) => {
	let calories = 0;
	const macros: Record<string, number> = {};
	for (const { id: ingId, qty } of meal.ingredients) {
		const ing = ingredients[ingId];
		if (!ing) continue;
		calories += ing.calories * qty;
		for (const [macId, macTotal] of Object.entries(ing.macros)) {
			macros[macId] = (macros[macId] || 0) + macTotal * qty;
		}
	}

	return { calories, macros };
};

export const selectIngredients = createSelector(
	[
		(state: RootState) =>
			foodApi.endpoints.getFood.select(undefined)(state)?.data?.ingredients ??
			EMPTY_ING,
	],
	(ingredients) => {
		return Object.fromEntries(
			ingredients.map((ing) => [ing.id, { ...ing }])
		);
	}
);

export const selectMeals = createSelector(
	[
		(state: RootState) =>
			foodApi.endpoints.getFood.select(undefined)(state)?.data?.meals ??
			EMPTY_MEALS,
		selectIngredients,
	],
	(meals, ingredients) => {
		// { mealId: {macro: value} }
		const formattedMeals: FormattedMeals = {};

		for (const meal of meals) {
			const { calories, macros } = calcMealTotals(meal, ingredients);
			formattedMeals[meal.id] = {
				title: meal.title,
				description: meal.description,
				calories: calories,
				macros: { ...macros },
				ingredients: Object.fromEntries(
					meal.ingredients.map((el) => [el.id, el.qty])
				),
				id: meal.id,
			};
		}
		return formattedMeals;
	}
);

export const selectCalorieHabit = createSelector(
	[
		(state) =>
			habitsApi.endpoints.getHabits.select(undefined)(state)?.data ?? [],
	],
	(habits) => {
		const calHabit = habits.find(
			(habit) => habit.id === PresetId.calorieCounter
		);
		if (calHabit && isCounterHabit(calHabit)) {
			return { ...calHabit };
		}
		return undefined;
	}
);
