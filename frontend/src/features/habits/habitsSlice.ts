import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Habit } from "../../utils/types";
import { getHabits } from "../../utils/storageHandler";
import { nanoid } from "nanoid";

const initialState: Habit[] = getHabits();

export const habitsSlice = createSlice({
	name: "habits",
	initialState,
	reducers: {
		addHabit: (state, action: PayloadAction<Habit>) => {
			state.push({ ...action.payload, id: nanoid() });
		},
		deleteHabit: (state, action: PayloadAction<string>) =>
			state.filter((habit: Habit) => habit.id !== action.payload),
		editHabit: (state, action: PayloadAction<Habit>) =>
			state.map((habit) =>
				habit.id === action.payload.id ? action.payload : habit
			),
	},
});

export const { addHabit, deleteHabit, editHabit } = habitsSlice.actions;

export default habitsSlice.reducer;
