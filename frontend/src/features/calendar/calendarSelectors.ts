import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { nextDay } from "../../utils/timeUtils";

export const selectSelectedWeek = (state: RootState) =>
	state.calendar.selectedWeek;

export const selectWeeklyTasks = (state: RootState) =>
	state.calendar.weeklyTasks;

export const selectRemainingWeeklyTasks = createSelector(
	[selectWeeklyTasks],
	(weeklyTasks) =>
		weeklyTasks.filter((task) => new Date(task.dateTime) >= new Date(nextDay()))
);
