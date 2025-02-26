import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { Habit } from "../../utils/types";
import { generateTasks } from "../tasks/tasksApi";
import { endOfWeek, startOfDay } from "../../utils/timeUtils";

export const selectSelectedWeek = (state: RootState) =>
	state.calendar.selectedWeek;

export const selectRemainingWeeklyTasks = (state: RootState) =>
	state.calendar.remainingWeeklyTasks;

// export const selectMissingWeeklyTasks = createSelector(
// 	[
// 		(_: RootState, habits: Habit[]) => habits,
// 		(_, __, startDate: string) => startDate,
// 	],
// 	(habits, startDate) => {
// 		const newStartDate = startOfDay(startDate);
// 		const endDate = endOfWeek(startDate);
// 		return generateTasks(habits, newStartDate, endDate);
// 	}
// );

// export const getSelectedWeek = createSelector(
// 	[(state: RootState) => state.calendar.selectedWeek],
// 	(selectedWeek) => selectedWeek
// );
