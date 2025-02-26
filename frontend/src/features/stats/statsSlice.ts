import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../utils/types";
import { startOfDay } from "../../utils/timeUtils";

interface DayStats {
	totalTasks: number;
	completeTasks: number;
	completionRate: number;
}

type StatsState = Record<string, DayStats>;

const initialState: StatsState = {};

const statsSlice = createSlice({
	name: "stats",
	initialState,
	reducers: {
		setPastStats: (state, action: PayloadAction<Task[]>) => {
			action.payload.forEach((task) => {
				const dateKey = startOfDay(task.dateTime);
				// assign init data for date
				if (!state[dateKey])
					state[dateKey] = {
						totalTasks: 0,
						completeTasks: 0,
						completionRate: 0,
					};

				// update state
				state[dateKey].totalTasks++;
				if (task.complete) state[dateKey].completeTasks++;

				// completion rate
				const { totalTasks, completeTasks } = state[dateKey];
				state[dateKey].completionRate =
					totalTasks > 0 ? Math.round((completeTasks / totalTasks) * 100) : 0;
			});
		},
	},
});

export const { setPastStats } = statsSlice.actions;
export default statsSlice.reducer;
