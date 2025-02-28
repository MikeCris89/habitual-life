import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { Task } from "../../utils/types";
import { endOfWeek, startOfDay, startOfWeek } from "../../utils/timeUtils";
import { tasksApi } from "../tasks/tasksApi";
import { selectRemainingWeeklyTasks } from "../calendar/calendarSelectors";
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

export const selectGoals = (state: RootState) =>
	metaApi.endpoints.getMeta.select(undefined)(state)?.data.goal;

export const selectCurrentGoal = createSelector([selectGoals], (goals) =>
	getGoalForDate(goals)
);

export const selectTasksToday = (state: RootState) =>
	tasksApi.endpoints.getDailyTasks.select(undefined)(state)?.data ??
	EMPTY_ARRAY;

export const selectPastMonthlyRates = createSelector(
	[selectStats],
	(pastStats) => {
		let totalTasks = 0;
		let completedTasks = 0;

		for (const dayStat of Object.values(pastStats)) {
			totalTasks += dayStat.totalTasks;
			completedTasks += dayStat.completedTasks;
		}

		return { totalTasks, completedTasks };
	}
);

export const selectCurrentStats = createSelector(
	[selectPastMonthlyRates, selectTasksToday, selectGoals],
	(monthlyRates, tasksToday, goals) => {
		const currentGoal = getGoalForDate(goals);
		const totalCompletedToday = tasksToday.filter(
			(task) => task.complete
		).length;
		const totalTasks = monthlyRates.totalTasks + tasksToday.length;

		const completedTasks = monthlyRates.completedTasks + totalCompletedToday;

		const completionRate =
			totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

		const status = forecastStatus(completionRate, currentGoal);

		return { completionRate, status };
	}
);

// OLD KEEP FOR FUTURE POSSIBLY
// export const selectCurrentWeekRates = createSelector(
// 	[selectCurrentWeekStats],
// 	(weekStats) => {
// 		let totalTasks = 0;
// 		let completedTasks = 0;

// 		for (const dayStat of Object.values(weekStats)) {
// 			totalTasks += dayStat.totalTasks;
// 			completedTasks += dayStat.completedTasks;
// 		}

// 		return { totalTasks, completedTasks };
// 	}
// );

// OLD keep for future possibly
// const calcForecast = (
// 	complete: number,
// 	expected: number,
// 	totalTasks: number
// ) => {
// 	let forecastStatus: "onTrack" | "slightlyBehind" | "veryBehind";
// 	if (complete >= expected) {
// 		forecastStatus = ForecastStatus.ON_TRACK;
// 	} else if (expected - complete <= 0.1 * totalTasks) {
// 		forecastStatus = ForecastStatus.SLIGHTLY_BEHIND;
// 	} else {
// 		forecastStatus = ForecastStatus.VERY_BEHIND;
// 	}

// 	return forecastStatus;
// };

// OLD stats and forecast - Keep for future
// export const oldselectCurrentStats = createSelector(
// 	[
// 		selectPastMonthlyRates,
// 		selectCurrentWeekRates,
// 		selectRemainingWeeklyTasks,
// 		selectTasksToday,
// 		selectGoals,
// 	],
// 	(monthRates, weekRates, remainingWeeklyTasks, tasksToday, goal) => {
// 		const monthlyStats = { completionRate: 0, forecastStatus: "" };
// 		const weeklyStats = { completionRate: 0, forecastStatus: "" };
// 		const dailyStats = { completionRate: 0, forecastStatus: "" };

// 		const totalTasksToday = tasksToday.length;
// 		const totalCompletedToday = tasksToday.filter(
// 			(task) => task.complete
// 		).length;

// 		monthlyStats.completionRate =
// 			monthRates.totalTasks + totalTasksToday > 0
// 				? Math.round(
// 						((monthRates.completedTasks + totalCompletedToday) /
// 							(monthRates.totalTasks + totalTasksToday)) *
// 							100
// 				  )
// 				: 0;

// 		weeklyStats.completionRate =
// 			weekRates.totalTasks + totalTasksToday > 0
// 				? Math.round(
// 						((weekRates.completedTasks + totalCompletedToday) /
// 							(weekRates.totalTasks + totalTasksToday)) *
// 							100
// 				  )
// 				: 0;

// 		dailyStats.completionRate =
// 			totalTasksToday > 0
// 				? Math.round((totalCompletedToday / totalTasksToday) * 100)
// 				: 0;

// 		// Forecast Monthly
// 		const totalMonthlyTasks = monthRates.totalTasks + totalTasksToday;
// 		const totalMonthlyTasksToWeekEnd =
// 			totalMonthlyTasks + remainingWeeklyTasks.length;
// 		const expectedMonthlyTaskCompletion = Math.round(
// 			(goal / 100) * totalMonthlyTasks
// 		);
// 		const expectedMonthlyProgressByToday =
// 			totalMonthlyTasks > 0
// 				? Math.round(
// 						(expectedMonthlyTaskCompletion / totalMonthlyTasks) *
// 							totalMonthlyTasksToWeekEnd
// 				  )
// 				: 0;

// 		// Forecast Weekly
// 		const totalWeeklyTasks = weekRates.totalTasks + totalTasksToday;
// 		const totalWeeklyTasksToWeekEnd =
// 			totalWeeklyTasks + remainingWeeklyTasks.length;
// 		const expectedWeeklyTaskCompletion = Math.round(
// 			(goal / 100) * totalWeeklyTasks
// 		);
// 		const expectedWeeklyProgressByToday =
// 			totalWeeklyTasks > 0
// 				? Math.round(
// 						(expectedWeeklyTaskCompletion / totalWeeklyTasks) *
// 							totalWeeklyTasksToWeekEnd
// 				  )
// 				: 0;

// 		monthlyStats.forecastStatus = calcForecast(
// 			monthRates.completedTasks + totalCompletedToday,
// 			expectedMonthlyProgressByToday,
// 			totalMonthlyTasks
// 		);
// 		weeklyStats.forecastStatus = calcForecast(
// 			weekRates.completedTasks + totalCompletedToday,
// 			expectedWeeklyProgressByToday,
// 			totalWeeklyTasks
// 		);

// 		return { monthlyStats, weeklyStats, dailyStats };
// 	}
// );

// VERY OLD DELETE
// export const selectMonthlyStats = createSelector(
// 	[selectStats, selectRemainingWeeklyTasks, selectGoal, selectTasksToday],
// 	(stats, remainingTasks, goal, tasksToday) => {
// 		console.log("MonthlyStats Selector running");
// 		const totalWeeklyTasks = remainingTasks.length;

// 		// Weekly Completion Rate
// 		let totalTasksUpToToday = tasksToday.length;
// 		let completedTasksUpToToday = tasksToday.filter(
// 			(task) => task.complete
// 		).length;

// 		for (const stat of Object.values(stats)) {
// 			totalTasksUpToToday += stat.totalTasks;
// 			completedTasksUpToToday += stat.completedTasks;
// 		}

// 		const completionRate =
// 			totalTasksUpToToday > 0
// 				? Math.round((completedTasksUpToToday / totalTasksUpToToday) * 100)
// 				: 0;

// 		// Forecast
// 		const expectedTaskCompletion = Math.round((goal / 100) * totalWeeklyTasks);
// 		const expectedProgressByToday = Math.round(
// 			(expectedTaskCompletion / totalWeeklyTasks) * totalTasksUpToToday
// 		);

// 		let forecastStatus: "onTrack" | "slightlyBehind" | "veryBehind";
// 		if (completedTasksUpToToday >= expectedProgressByToday) {
// 			forecastStatus = "onTrack";
// 		} else if (
// 			expectedProgressByToday - completedTasksUpToToday <=
// 			0.1 * totalWeeklyTasks
// 		) {
// 			forecastStatus = "slightlyBehind";
// 		} else {
// 			forecastStatus = "veryBehind";
// 		}

// 		return { completionRate, forecastStatus };
// 	}
// );

// export const selectWeeklyStats = createSelector(
// 	[
// 		selectStats,
// 		(
// 			_,
// 			selectorProps: {
// 				tasksToday: Task[];
// 				weeklyTasks: Task[];
// 				date: string;
// 				goal: number;
// 			}
// 		) => selectorProps,
// 	],
// 	(stats, { tasksToday, date, weeklyTasks, goal }) => {
// 		const weekStart = new Date(startOfWeek(date));
// 		const weekEnd = new Date(endOfWeek(date));

// 		const totalWeeklyTasks = weeklyTasks.length;

// 		// Weekly Completion Rate
// 		let totalTasksUpToToday = tasksToday.length;
// 		let completedTasksUpToToday = tasksToday.filter(
// 			(task) => task.complete
// 		).length;

// 		for (const [day, stat] of Object.entries(stats)) {
// 			const dayDate = new Date(day);
// 			if (dayDate >= weekStart && dayDate < weekEnd) {
// 				totalTasksUpToToday += stat.totalTasks;
// 				completedTasksUpToToday += stat.completedTasks;
// 			}
// 		}

// 		const completionRate =
// 			totalTasksUpToToday > 0
// 				? Math.round((completedTasksUpToToday / totalTasksUpToToday) * 100)
// 				: 0;

// 		// Forecast
// 		const expectedTaskCompletion = Math.round((goal / 100) * totalWeeklyTasks);
// 		const expectedProgressByToday = Math.round(
// 			(expectedTaskCompletion / totalWeeklyTasks) * totalTasksUpToToday
// 		);

// 		let forecastStatus: ForecastStatus;
// 		if (completedTasksUpToToday >= expectedProgressByToday) {
// 			forecastStatus = ForecastStatus.ON_TRACK;
// 		} else if (
// 			expectedProgressByToday - completedTasksUpToToday <=
// 			0.1 * totalWeeklyTasks
// 		) {
// 			forecastStatus = ForecastStatus.SLIGHTLY_BEHIND;
// 		} else {
// 			forecastStatus = ForecastStatus.VERY_BEHIND;
// 		}

// 		return { completionRate, forecastStatus };
// 	}
// );

// export const selectDailyStats = createSelector(
// 	[selectStats, selectTasksToday],
// 	(stats, tasksToday) => {
// 		console.log("DailyStats Selector running");
// 		let total = tasksToday.length;
// 		let complete = tasksToday.filter((task) => task.complete).length;

// 		for (const task of tasksToday) {
// 			total++;
// 			complete += task.complete ? 1 : 0;
// 		}

// 		const completionRate = total > 0 ? Math.round((complete / total) * 100) : 0;

// 		return { completionRate };
// 	}
// );
