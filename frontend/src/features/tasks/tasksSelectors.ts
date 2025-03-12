import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { tasksApi } from "./tasksApi";
import { isBadTask, isCounterTask, isGoodTask, Task } from "../../utils/types";

export const selectTasks = (state: RootState) =>
	tasksApi.endpoints.getDailyTasks.select(undefined)(state)?.data ?? [];

export const selectGoodTasksToday = createSelector([selectTasks], (tasks) => {
	return tasks.filter(isGoodTask).reduce<Record<string, Task[]>>(
		(acc, task) => {
			acc.allTasks.push(task);
			task.allDay ? acc.tasksAllDay.push(task) : acc.tasksByTime.push(task);
			return acc;
		},
		{ allTasks: [], tasksAllDay: [], tasksByTime: [] }
	);
});
export const selectBadTasksToday = createSelector([selectTasks], (tasks) => {
	return tasks.filter(isBadTask);
});
export const selectCounterTasksToday = createSelector(
	[selectTasks],
	(tasks) => {
		return tasks.filter(isCounterTask);
	}
);
