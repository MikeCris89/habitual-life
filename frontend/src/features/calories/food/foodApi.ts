import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { dbActions } from "../../../utils/indexedDb";
import { Ingredients, Meals } from "../../../utils/types";

export const foodApi = createApi({
	reducerPath: "food",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => ({
		getFood: builder.query<
			{ ingredients: Ingredients[]; meals: Meals[] },
			void
		>({
			queryFn: async () => {
				try {
					const ingredients = (await dbActions.getAll("ingredients")) ?? [];
					const meals = (await dbActions.getAll("meals")) ?? [];
					return { data: { ingredients, meals } };
				} catch (e) {
					return { error: { message: `Error fetching food. Error: ${e}` } };
				}
			},
		}),
		addEditIngredient: builder.mutation({
			queryFn: async (ing: Ingredients) => {
				try {
					const data = await dbActions.put("ingredients", ing);
					return { data };
				} catch (e) {
					return {
						error: { message: `Error adding/editing ingredient. Error: ${e}` },
					};
				}
			},
			async onQueryStarted(ing, { dispatch }) {
				dispatch(
					foodApi.util.updateQueryData("getFood", undefined, (draft) => {
						const index = draft.ingredients.findIndex((el) => el.id === ing.id);
						if (index !== -1) {
							draft.ingredients[index] = { ...ing };
						} else {
							draft.ingredients.push({ ...ing });
						}
					})
				);
			},
		}),
		addEditMeal: builder.mutation({
			queryFn: async (meal: Meals) => {
				try {
					const data = await dbActions.put("meals", meal);
					return { data };
				} catch (e) {
					return {
						error: { message: `Error adding/editing meal. Error ${e}` },
					};
				}
			},
			async onQueryStarted(meal, { dispatch }) {
				dispatch(
					foodApi.util.updateQueryData("getFood", undefined, (draft) => {
						const index = draft.meals.findIndex((el) => el.id === meal.id);
						if (index !== -1) {
							draft.meals[index] = { ...meal };
						} else {
							draft.meals.push({ ...meal });
						}
					})
				);
			},
		}),
		deleteIngredient: builder.mutation({
			queryFn: async (ing: Ingredients) => {
				try {
					const data = await dbActions.delete("ingredients", ing.id);
					return { data };
				} catch (e) {
					return {
						error: { message: `Error deleting ingredient. Error ${e}` },
					};
				}
			},
		}),
		deleteMeal: builder.mutation({
			queryFn: async (meal: Meals) => {
				try {
					const data = await dbActions.delete("meals", meal.id);
					return { data };
				} catch (e) {
					return {
						error: { message: `Error deleting meal. Error ${e}` },
					};
				}
			},
		}),
	}),
});

export const {
	useGetFoodQuery,
	useAddEditIngredientMutation,
	useAddEditMealMutation,
	useDeleteIngredientMutation,
	useDeleteMealMutation,
} = foodApi;
