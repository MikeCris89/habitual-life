import {
	BasketItems,
	FoodCategory,
	Baskets,
	IngredientForm,
	MealForm,
} from "./../../../utils/types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { dbActions } from "../../../utils/indexedDb";

export const foodApi = createApi({
	reducerPath: "food",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["baskets"],
	endpoints: (builder) => ({
		getFood: builder.query<
			{ ingredients: IngredientForm[]; meals: MealForm[] },
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
		getBaskets: builder.query<Baskets[], void>({
			queryFn: async () => {
				try {
					const data = (await dbActions.getAll("baskets")) ?? [];
					return { data };
				} catch (e) {
					return { error: { message: "Error getting baskets from DB." } };
				}
			},
			providesTags: ["baskets"],
		}),
		addEditIngredient: builder.mutation({
			queryFn: async (ing: IngredientForm) => {
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
			queryFn: async (meal: MealForm) => {
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
		addBasket: builder.mutation({
			queryFn: async (basket: Baskets) => {
				try {
					const data = await dbActions.put("baskets", basket);
					return { data };
				} catch (e) {
					return { error: { message: "Error saving basket to DB." } };
				}
			},
			onQueryStarted: (basket, { dispatch }) => {
				dispatch(
					foodApi.util.updateQueryData("getBaskets", undefined, (draft) => {
						const existing = draft.findIndex((el) => el.id === basket.id);
						if (existing !== -1) {
							draft[existing] = basket;
						} else {
							draft.push(basket);
						}
					})
				);
			},
		}),
		deleteBasket: builder.mutation({
			queryFn: async (basketId: string) => {
				try {
					const data = await dbActions.delete("baskets", basketId);
					return { data };
				} catch (e) {
					return { error: { message: `Error deleting basket. ${e}` } };
				}
			},
			onQueryStarted: (basketId, { dispatch }) => {
				dispatch(
					foodApi.util.updateQueryData("getBaskets", undefined, (draft) => {
						const index = draft.findIndex((basket) => basket.id === basketId);
						if (index !== -1) draft.splice(index, 1);
					})
				);
			},
		}),
		clearDailyBaskets: builder.mutation({
			queryFn: async (_arg) => {
				try {
					const data = await dbActions.clearBaskets();
					return { data };
				} catch (e) {
					return { error: { message: "Error clearing daily baskets." } };
				}
			},
			invalidatesTags: ["baskets"],
		}),
		deleteIngredient: builder.mutation({
			queryFn: async (ing: IngredientForm) => {
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
			queryFn: async (meal: MealForm) => {
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
	useGetBasketsQuery,
	useAddEditIngredientMutation,
	useAddEditMealMutation,
	useAddBasketMutation,
	useDeleteBasketMutation,
	useClearDailyBasketsMutation,
	useDeleteIngredientMutation,
	useDeleteMealMutation,
} = foodApi;
