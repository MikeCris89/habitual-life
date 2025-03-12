// import { Habit } from "./../../utils/types";
// import { endOfWeek, nextDay, startOfWeek } from "../../utils/timeUtils";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Task } from "../../utils/types";
// import { generateTasks } from "../tasks/tasksApi";

// interface CalendarState {
// 	selectedWeek: string;
// 	weeklyTasks: Task[];
// }

// const initialState: CalendarState = {
// 	selectedWeek: startOfWeek(),
// 	weeklyTasks: [],
// };

// const calendarSlice = createSlice({
// 	name: "calendar",
// 	initialState,
// 	reducers: {
// 		setSelectedWeek: (state, action: PayloadAction<string>) => {
// 			state.selectedWeek = action.payload;
// 		},
// 		setWeeklyTasks: (state, action: PayloadAction<Habit[]>) => {
// 			state.weeklyTasks = generateTasks(
// 				action.payload,
// 				startOfWeek(),
// 				endOfWeek()
// 			);
// 		},
// 	},
// });

// export const { setSelectedWeek, setWeeklyTasks } = calendarSlice.actions;
// export default calendarSlice.reducer;

export const calendarSlice = () => {};
