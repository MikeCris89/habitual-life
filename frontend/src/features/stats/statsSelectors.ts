import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { Task } from "../../utils/types";
import { endOfWeek, startOfWeek } from "../../utils/timeUtils";
import { tasksApi } from "../tasks/tasksApi";
import { selectRemainingWeeklyTasks } from "../calendar/calendarSelectors";
import { metaApi } from "../meta/metaApi";

export enum ForecastStatus {
	ON_TRACK = "onTrack",
	SLIGHTLY_BEHIND = "slightlyBehind",
	VERY_BEHIND = "veryBehind",
}

const EMPTY_ARRAY: Task[] = [];

export const selectStats = (state: RootState) => state.stats;

const selectGoal = (state: RootState) =>
	metaApi.endpoints.getMeta.select(undefined)(state)?.data.goal ?? 70;

const selectTasksToday = (state: RootState) =>
	tasksApi.endpoints.getDailyTasks.select(undefined)(state)?.data ??
	EMPTY_ARRAY;

export const selectMonthlyStats = createSelector(
	[selectStats, selectRemainingWeeklyTasks, selectGoal, selectTasksToday],
	(stats, remainingTasks, goal, tasksToday) => {
		console.log("MonthlyStats Selector running");
		const totalWeeklyTasks = remainingTasks.length;

		// Weekly Completion Rate
		let totalTasksUpToToday = tasksToday.length;
		let completedTasksUpToToday = tasksToday.filter(
			(task) => task.complete
		).length;

		for (const stat of Object.values(stats)) {
			totalTasksUpToToday += stat.totalTasks;
			completedTasksUpToToday += stat.completeTasks;
		}

		const completionRate =
			totalTasksUpToToday > 0
				? Math.round((completedTasksUpToToday / totalTasksUpToToday) * 100)
				: 0;

		// Forecast
		const expectedTaskCompletion = Math.round((goal / 100) * totalWeeklyTasks);
		const expectedProgressByToday = Math.round(
			(expectedTaskCompletion / totalWeeklyTasks) * totalTasksUpToToday
		);

		let forecastStatus: "onTrack" | "slightlyBehind" | "veryBehind";
		if (completedTasksUpToToday >= expectedProgressByToday) {
			forecastStatus = "onTrack";
		} else if (
			expectedProgressByToday - completedTasksUpToToday <=
			0.1 * totalWeeklyTasks
		) {
			forecastStatus = "slightlyBehind";
		} else {
			forecastStatus = "veryBehind";
		}

		return { completionRate, forecastStatus };
	}
);

export const selectWeeklyStats = createSelector(
	[
		selectStats,
		(
			_,
			selectorProps: {
				tasksToday: Task[];
				weeklyTasks: Task[];
				date: string;
				goal: number;
			}
		) => selectorProps,
	],
	(stats, { tasksToday, date, weeklyTasks, goal }) => {
		const weekStart = new Date(startOfWeek(date));
		const weekEnd = new Date(endOfWeek(date));

		const totalWeeklyTasks = weeklyTasks.length;

		// Weekly Completion Rate
		let totalTasksUpToToday = tasksToday.length;
		let completedTasksUpToToday = tasksToday.filter(
			(task) => task.complete
		).length;

		for (const [day, stat] of Object.entries(stats)) {
			const dayDate = new Date(day);
			if (dayDate >= weekStart && dayDate < weekEnd) {
				totalTasksUpToToday += stat.totalTasks;
				completedTasksUpToToday += stat.completeTasks;
			}
		}

		const completionRate =
			totalTasksUpToToday > 0
				? Math.round((completedTasksUpToToday / totalTasksUpToToday) * 100)
				: 0;

		// Forecast
		const expectedTaskCompletion = Math.round((goal / 100) * totalWeeklyTasks);
		const expectedProgressByToday = Math.round(
			(expectedTaskCompletion / totalWeeklyTasks) * totalTasksUpToToday
		);

		let forecastStatus: ForecastStatus;
		if (completedTasksUpToToday >= expectedProgressByToday) {
			forecastStatus = ForecastStatus.ON_TRACK;
		} else if (
			expectedProgressByToday - completedTasksUpToToday <=
			0.1 * totalWeeklyTasks
		) {
			forecastStatus = ForecastStatus.SLIGHTLY_BEHIND;
		} else {
			forecastStatus = ForecastStatus.VERY_BEHIND;
		}

		return { completionRate, forecastStatus };
	}
);

export const selectDailyStats = createSelector(
	[selectStats, selectTasksToday],
	(stats, tasksToday) => {
		console.log("DailyStats Selector running");
		let total = tasksToday.length;
		let complete = tasksToday.filter((task) => task.complete).length;

		for (const task of tasksToday) {
			total++;
			complete += task.complete ? 1 : 0;
		}

		const completionRate = total > 0 ? Math.round((complete / total) * 100) : 0;

		return { completionRate };
	}
);
