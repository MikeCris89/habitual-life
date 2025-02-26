import { Habit } from "./../../utils/types";
import { endOfWeek, nextDay, startOfWeek } from "../../utils/timeUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../utils/types";
import { generateTasks } from "../tasks/tasksApi";

interface CalendarState {
	selectedWeek: string;
	remainingWeeklyTasks: Task[];
}

const initialState: CalendarState = {
	selectedWeek: startOfWeek(),
	remainingWeeklyTasks: [],
};

const calendarSlice = createSlice({
	name: "calendar",
	initialState,
	reducers: {
		setSelectedWeek: (state, action: PayloadAction<string>) => {
			state.selectedWeek = action.payload;
		},
		setRemainingWeeklyTasks: (state, action: PayloadAction<Habit[]>) => {
			state.remainingWeeklyTasks = generateTasks(
				action.payload,
				nextDay(),
				endOfWeek()
			);
		},
	},
});

export const { setSelectedWeek, setRemainingWeeklyTasks } =
	calendarSlice.actions;
export default calendarSlice.reducer;
