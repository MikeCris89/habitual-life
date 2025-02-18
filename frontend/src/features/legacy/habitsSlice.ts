import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Habit } from "../../utils/types";
import { nanoid } from "nanoid";
import { dbActions } from "../../utils/indexedDb";

const initialState: {
	habits: Habit[];
	habitsLoading: boolean;
	habitsError: boolean;
} = {
	habits: [],
	habitsLoading: false,
	habitsError: false,
};

export const addHabit = createAsyncThunk<Habit, Habit>(
	"habits/addHabit",
	async (newHabit: Habit, thunkAPI) => {
		const resp = await dbActions.put("habits", { ...newHabit, id: nanoid() });
		return resp;
	}
);

export const deleteHabit = createAsyncThunk<void, string>(
	"habits/deleteHabit",
	async (id: string, thunkAPI) => {
		await dbActions.delete("habits", id);
	}
);

export const editHabit = createAsyncThunk<Habit, Habit>(
	"habits/editHabit",
	async (habit, thunkAPI) => {
		const resp = await dbActions.put("habits", habit);
		return resp;
	}
);

export const fetchHabits = createAsyncThunk<Habit[]>(
	"habits/fetchHabits",
	async (_, thunkAPI) => {
		const resp = await dbActions.getAll("habits");
		return resp || [];
	}
);

export const habitsSlice = createSlice({
	name: "habits",
	initialState,
	reducers: {
		// addHabit: (state, action: PayloadAction<Habit>) => {
		// 	state.push({ ...action.payload, id: nanoid() });
		// },
		// deleteHabit: (state, action: PayloadAction<string>) => {
		// 	state.habits = state.habits.filter(
		// 		(habit: Habit) => habit.id !== action.payload
		// 	);
		// },
		// editHabit: (state, action: PayloadAction<Habit>) => {
		// 	state.habits = state.habits.map((habit) =>
		// 		habit.id === action.payload.id ? action.payload : habit
		// 	);
		// },
	},
	extraReducers: (builder) => {
		builder
			// ADD HABIT
			.addCase(addHabit.pending, (state) => {
				state.habitsLoading = true;
				state.habitsError = false;
			})
			.addCase(addHabit.fulfilled, (state, action) => {
				state.habitsLoading = false;
				state.habitsError = false;
				state.habits.push(action.payload);
			})
			.addCase(addHabit.rejected, (state) => {
				state.habitsLoading = false;
				state.habitsError = true;
			})
			// DELETE HABIT
			.addCase(deleteHabit.pending, (state, action) => {
				state.habitsLoading = true;
				state.habitsError = false;
				state.habits = state.habits.filter(
					(habit) => habit.id !== action.meta.arg
				);
			})
			.addCase(deleteHabit.fulfilled, (state, action) => {
				state.habitsLoading = false;
				state.habitsError = false;
			})
			.addCase(deleteHabit.rejected, (state, action) => {
				state.habitsLoading = false;
				state.habitsError = true;
			})
			// EDIT HABIT
			.addCase(editHabit.pending, (state, action) => {
				state.habitsLoading = true;
				state.habitsError = false;
			})
			.addCase(editHabit.fulfilled, (state, action) => {
				state.habitsLoading = false;
				state.habitsError = false;
				state.habits = state.habits.map((habit) =>
					habit.id === action.payload.id ? action.payload : habit
				);
			})
			//FETCH HABIT
			.addCase(fetchHabits.pending, (state) => {
				state.habitsLoading = true;
				state.habitsError = false;
			})
			.addCase(fetchHabits.fulfilled, (state, action) => {
				state.habitsLoading = false;
				state.habitsError = false;
				state.habits = action.payload;
			})
			.addCase(fetchHabits.rejected, (state) => {
				state.habitsLoading = false;
				state.habitsError = true;
			});
	},
});

//export const { deleteHabit, editHabit } = habitsSlice.actions;

export default habitsSlice.reducer;
