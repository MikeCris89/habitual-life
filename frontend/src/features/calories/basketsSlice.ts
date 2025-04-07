// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {
// 	CounterTask,
// 	CustomForm,
// 	NutritionalInfo,
// 	//IngredientLog,
// 	MacrosType,
// 	//MealLog,
// 	FOOD_CATEGORIES,
// 	//LogTypes,
// 	getFoodCategory,
// 	FoodCategory,
// 	isIngOrCustom,
// 	//LogKeys,
// 	isValidKey,
// 	isIngredientLog,
// 	isMealLog,
// 	isCustomLog,
// 	Baskets,
// } from "../../utils/types";
// import { RootState } from "../../app/store";
// import { foodApi } from "./food/foodApi";
// import { nanoid } from "nanoid";

// export interface MacroState extends MacrosType {
// 	amount: number;
// }

// interface InitState {
// 	//baskets: Baskets[];
// 	currentBasket: Baskets;
// 	// formEntries: {
// 	// 	[FOOD_CATEGORIES.INGREDIENTS]: IngredientLog | null;
// 	// 	[FOOD_CATEGORIES.MEALS]: MealLog | null;
// 	// 	[FOOD_CATEGORIES.CUSTOM]: CustomLog | null;
// 	// };
// }

// const initialState: InitState = {
// 	//	baskets: [],
// 	currentBasket: {
// 		[FOOD_CATEGORIES.INGREDIENTS]: [],
// 		[FOOD_CATEGORIES.MEALS]: [],
// 		[FOOD_CATEGORIES.CUSTOM]: [],
// 		time: "",
// 		id: "",
// 	},
// 	// formEntries: {
// 	// 	[FOOD_CATEGORIES.INGREDIENTS]: null,
// 	// 	[FOOD_CATEGORIES.MEALS]: null,
// 	// 	[FOOD_CATEGORIES.CUSTOM]: null,
// 	// },
// };

// const basketsSlice = createSlice({
// 	name: "baskets",
// 	initialState,
// 	reducers: {
// 		// setInitValues: (
// 		// 	state,
// 		// 	action: PayloadAction<{ calTask: CounterTask; baskets: Baskets[] }>
// 		// ) => {
// 		// 	const { calTask, baskets } = action.payload;
// 		// 	state.baskets = [...baskets];
// 		// },

// 		addIngredient: (state, action: PayloadAction<string>) => {
// 			state.currentBasket.ingredients.push(action.payload);
// 		},
// 		addMeal: (state, action: PayloadAction<string>) => {
// 			state.currentBasket.meals.push(action.payload);
// 		},
// 		addCustom: (state, action: PayloadAction<CustomForm>) => {
// 			state.currentBasket.custom.push(action.payload);
// 		},
// 		// setInitForm: (state, action: PayloadAction<LogTypes>) => {
// 		// 	const category = getFoodCategory(action.payload);
// 		// 	state.formEntries[category] = action.payload as any;
// 		// },
// 		// setFormEntry: (
// 		// 	state,
// 		// 	action: PayloadAction<{
// 		// 		foodCat: FoodCategory;
// 		// 		key: LogKeys;
// 		// 		value: any;
// 		// 	}>
// 		// ) => {
// 		// 	const { foodCat, key, value } = action.payload;
// 		// 	const entry = state.formEntries[foodCat];

// 		// 	if (entry && isValidKey(entry, key)) entry[key] = value;
// 		// },
// 		// setFormMacros: (
// 		// 	state,
// 		// 	action: PayloadAction<{
// 		// 		foodCat: Exclude<FoodCategory, "meals">;
// 		// 		id: string;
// 		// 		value: number;
// 		// 	}>
// 		// ) => {
// 		// 	const { foodCat, id, value } = action.payload;
// 		// 	const entry = state.formEntries[foodCat];
// 		// 	if (entry && isIngOrCustom(entry)) {
// 		// 		entry.macros[id] = value;
// 		// 	}
// 		// },
// 		// clearFormEntry: (state, action: PayloadAction<FoodCategory>) => {
// 		// 	state.formEntries[action.payload] = null;
// 		// },
// 		// addFormToCurrent: (state, action: PayloadAction<FoodCategory>) => {
// 		// 	const cat = action.payload;
// 		// 	const entry = state.formEntries[cat];
// 		// 	if (entry != null) {
// 		// 		if (cat !== FOOD_CATEGORIES.CUSTOM)
// 		// 			state.currentBasket[cat].push(entry.id);
// 		// 		else state.currentBasket[cat].push(entry as CustomLog);
// 		// 		state.formEntries[cat] = null;
// 		// 	}
// 		// },
// 		// submitBasket: (state) => {
// 		// 	state.baskets.push({
// 		// 		...state.currentBasket,
// 		// 		time: new Date().toISOString(),
// 		// 		id: nanoid(),
// 		// 	});
// 		// },
// 	},
// });

// export default basketsSlice.reducer;
// export const {
// 	//setInitValues,
// 	addIngredient,
// 	addMeal,
// 	addCustom,
// 	// setInitForm,
// 	// setFormEntry,
// 	// setFormMacros,
// 	// addFormToCurrent,
// 	// clearFormEntry,
// 	//submitBasket,
// } = basketsSlice.actions;

export const basketsSlice = () => {};
