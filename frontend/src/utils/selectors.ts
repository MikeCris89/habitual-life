import { createSelector } from "reselect";
import { RootState } from "../app/store";
import { DayKeys, HabitTypes, Task } from "./types";
import { startOfDay } from "./timeUtils";

export const selectHabits = createSelector(
	[(state: RootState) => state.habits],
	(habits) => habits
);

export const selectHabitsToday = createSelector([selectHabits], (habits) =>
	habits.filter(
		(habit) => habit.daysOfWeek[DayKeys[new Date().getDay()]].isTrue
	)
);

// TASKS
export const selectTasks = createSelector(
	[(state: RootState) => state.tasks],
	(tasks) => tasks
);

export const selectTasksToday = createSelector(
	[selectTasks],
	(weeklyTasks): Task[] | undefined => {
		const start = startOfDay();
		const tasks = weeklyTasks?.tasks[start];
		if (tasks)
			return [...tasks].sort((a, b) => {
				if (!a.dateTime && !b.dateTime) return 0;
				if (!a.dateTime) return -1;
				if (!b.dateTime) return 1;

				return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
			});
		return undefined;
	}
);

export const selectBadTasksToday = createSelector(
	[selectTasksToday],
	(tasksToday) => {
		return tasksToday?.filter((task) => task.type === HabitTypes.BAD);
	}
);

export const selectGoodTasksToday = createSelector(
	[selectTasksToday],
	(tasksToday) => {
		return tasksToday?.filter((task) => task.type === HabitTypes.GOOD);
	}
);

export const selectCounterTasksToday = createSelector(
	[selectTasksToday],
	(tasksToday) => {
		return tasksToday?.filter((task) => task.type === HabitTypes.COUNTER);
	}
);
