import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../utils/types";
import { startOfDay } from "../../utils/timeUtils";

interface DayStats {
	totalTasks: number;
	completedTasks: number;
	completionRate: number;
}

type StatsState = {
	totalTasks: number;
	completedTasks: number;
	pastStats: Record<string, DayStats>;
};

const initialState: StatsState = {
	totalTasks: 0,
	completedTasks: 0,
	pastStats: {},
};

const statsSlice = createSlice({
	name: "stats",
	initialState,
	reducers: {
		setPastStats: (state, action: PayloadAction<Task[]>) => {
			console.log("setPastStats - pastTasks:", action.payload);
			action.payload.forEach((task) => {
				const dateKey = startOfDay(task.dateTime);

				state.totalTasks++;
				if (task.complete) state.completedTasks++;

				// assign init data for date
				if (!state.pastStats[dateKey])
					state.pastStats[dateKey] = {
						totalTasks: 0,
						completedTasks: 0,
						completionRate: 0,
					};

				// update state
				state.pastStats[dateKey].totalTasks++;
				if (task.complete) state.pastStats[dateKey].completedTasks++;

				// completion rate
				const { totalTasks, completedTasks } = state.pastStats[dateKey];
				state.pastStats[dateKey].completionRate =
					totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
			});
		},
		resetPastStats: () => initialState,
	},
});

export const { setPastStats, resetPastStats } = statsSlice.actions;
export default statsSlice.reducer;
