import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { Habit } from "../../utils/types";
import { generateTasks } from "../tasks/tasksApi";
import { endOfWeek, nextDay, startOfDay } from "../../utils/timeUtils";

export const selectMissingWeeklyTasks = createSelector(
	[
		(_: RootState, habits: Habit[]) => habits,
		(_, __, startDate: string) => startDate,
	],
	(habits, startDate) => {
		const newStartDate = new Date(startOfDay(new Date(startDate)));
		const endDate = new Date(endOfWeek(new Date(startDate)));
		console.log(startDate, newStartDate, endDate);
		return generateTasks(habits, newStartDate, endDate);
	}
);

// export const getSelectedWeek = createSelector(
// 	[(state: RootState) => state.calendar.selectedWeek],
// 	(selectedWeek) => selectedWeek
// );
