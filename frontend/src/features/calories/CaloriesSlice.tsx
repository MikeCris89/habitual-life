import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CounterTask, Food, MacrosType } from "../../utils/types";

export interface MacroState extends MacrosType {
	amount: number;
}

const initCal = {
	amount: 0,
};

const initMacros: MacroState[] = [];

const initialState = {
	calories: { ...initCal },
	macros: [...initMacros],
};

const caloriesSlice = createSlice({
	name: "calories",
	initialState,
	reducers: {
		setInitValues: (state, action: PayloadAction<CounterTask>) => {
			const calTask = action.payload;
			state.calories = { amount: state.calories.amount || 0 };
			state.macros =
				calTask.macros?.map((mac) => ({
					...mac,
					amount: state.macros.find((el) => el.id === mac.id)?.amount || 0,
				})) || [];
		},
		submitBasket: (state, action: PayloadAction<CounterTask>) => {
			const calTask = action.payload;
			state.calories = { amount: 0 };
			state.macros =
				calTask.macros?.map((mac) => ({
					...mac,
					amount: 0,
				})) || [];
		},
		setCalories: (state, action: PayloadAction<number>) => {
			state.calories.amount = action.payload;
		},
		setMacros: (
			state,
			action: PayloadAction<{ value: number; id: string }>
		) => {
			const { value, id } = action.payload;
			const mac = state.macros.find((el) => el.id === id);
			if (!mac) return;

			mac.amount = value;
		},
	},
});

export default caloriesSlice.reducer;
export const { setInitValues, setCalories, setMacros, submitBasket } =
	caloriesSlice.actions;
