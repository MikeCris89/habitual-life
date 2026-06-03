import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { Task } from "../../utils/types";
import { endOfWeek, startOfDay, startOfWeek } from "../../utils/timeUtils";
import { tasksApi } from "../tasks/tasksApi";
import { metaApi } from "../meta/metaApi";

export enum ForecastStatus {
	ON_TRACK = "onTrack",
	SLIGHTLY_BEHIND = "slightlyBehind",
	VERY_BEHIND = "veryBehind",
}

const forecastStatus = (completionRate: number, goal: number) => {
	if (completionRate >= goal) return ForecastStatus.ON_TRACK;
	if (completionRate >= goal - 10) return ForecastStatus.SLIGHTLY_BEHIND;
	return ForecastStatus.VERY_BEHIND;
};

const getGoalForDate = (
	goals: Record<string, number>,
	date: string = startOfDay()
) => {
	const goalArr = Object.keys(goals)
		.filter((goalDate) => new Date(goalDate) <= new Date(date))
		.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

	return goals[goalArr[0]];
};

const EMPTY_ARRAY: Task[] = [];

export const selectStats = (state: RootState) => state.stats;

export const selectCurrentWeekStats = createSelector([selectStats], (stats) =>
	Object.fromEntries(
		Object.entries(stats).filter(
			([date]) =>
				new Date(date) >= new Date(startOfWeek()) &&
				new Date(date) < new Date(endOfWeek())
		)
	)
);

const EMPTY_GOAL = {};

export const selectGoals = (state: RootState) =>
	metaApi.endpoints.getMeta.select(undefined)(state)?.data?.goal ?? EMPTY_GOAL;

export const selectCurrentGoal = createSelector([selectGoals], (goals) =>
	getGoalForDate(goals)
);

export const selectTasksToday = (state: RootState) =>
	tasksApi.endpoints.getDailyTasks.select(undefined)(state)?.data ??
	EMPTY_ARRAY;

export const selectCurrentStats = createSelector(
	[selectStats, selectTasksToday, selectCurrentGoal],
	(stats, tasksToday, currentGoal) => {
		const totalCompletedToday = tasksToday.filter(
			(task) => task.complete
		).length;
		const totalTasks = stats.totalTasks + tasksToday.length;

		const completedTasks = stats.completedTasks + totalCompletedToday;

		const completionRate =
			totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

		const status = forecastStatus(completionRate, currentGoal);

		return { completionRate, status };
	}
);

