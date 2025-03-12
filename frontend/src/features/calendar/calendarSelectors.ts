import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { endOfWeek, nextDay, startOfWeek } from "../../utils/timeUtils";
import { habitsApi } from "../habits/habitsApi";
import { generateTasks } from "../tasks/tasksApi";
import { Habit } from "../../utils/types";

// export const selectSelectedWeek = (state: RootState) =>
// 	state.calendar.selectedWeek;

// export const selectWeeklyTasks = (state: RootState) =>
// 	state.calendar.weeklyTasks;

const EMPTY_HABIT_ARR: Habit[] = [];

export const selectWeeklyTasks = createSelector(
	[
		(state: RootState) =>
			habitsApi.endpoints.getHabits.select(undefined)(state)?.data ??
			EMPTY_HABIT_ARR,
	],
	(habits) => generateTasks(habits, startOfWeek(), endOfWeek())
);

export const selectRemainingWeeklyTasks = createSelector(
	[selectWeeklyTasks],
	(weeklyTasks) =>
		weeklyTasks.filter((task) => new Date(task.dateTime) >= new Date(nextDay()))
);
