import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { dbActions } from "../../utils/indexedDb";
import {
	CounterTask,
	DayKeys,
	Habit,
	HabitTypes,
	isCounterHabit,
	isGoodHabit,
	Task,
	TaskBase,
} from "../../utils/types";
import {
	dayBefore,
	nextDay,
	startOfDay,
	statsStartDate,
} from "../../utils/timeUtils";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

const createTask = (habit: Habit, date: string): Task => {
	const baseTask: TaskBase = {
		title: habit.title,
		habitId: habit.id,
		dateTime: date,
		complete: false,
		id: nanoid(),
	};

	if (isCounterHabit(habit)) {
		return {
			...baseTask,
			type: HabitTypes.COUNTER,
			max: habit.max,
			total: habit.total,
			count: 0,
		};
	}

	if (isGoodHabit(habit)) {
		return {
			...baseTask,
			type: HabitTypes.GOOD,
			allDay: habit.allDay,
		};
	}
	const newTask = { ...baseTask, type: habit.type };
	return newTask;
};

export const generateTestTasksData = (
	habits: Habit[],
	completionRate: number,
	startDate: string = startOfDay(),
	endDate: string = nextDay()
): Task[] => {
	const tasks = [];
	const end = dayjs(endDate);
	for (
		let date = dayjs(startDate);
		date.isBefore(end);
		date = date.add(1, "day")
	) {
		const dayKey = DayKeys[date.day()];
		const dailyTasks = habits
			.filter((habit) => habit.daysOfWeek[dayKey].isTrue)
			.flatMap((habit) => {
				if (!isGoodHabit(habit) || habit.allDay)
					return {
						...createTask(habit, date.toISOString()),
						complete: Math.random() * 100 <= completionRate,
					};

				return habit.timeOfDay.map(({ time }) => {
					const thisTime = dayjs(time);
					return {
						...createTask(
							habit,
							date
								.hour(thisTime.hour())
								.minute(thisTime.minute())
								.second(0)
								.millisecond(0)
								.toISOString()
						),
						complete: Math.random() * 100 <= completionRate,
					};
				});
			});
		tasks.push(...dailyTasks);
	}
	return tasks;
};

export const generateTasks = (
	habits: Habit[],
	startDate: string = startOfDay(),
	endDate: string = nextDay()
): Task[] => {
	const tasks = [];
	const end = dayjs(endDate);
	for (
		let date = dayjs(startDate);
		date.isBefore(end);
		date = date.add(1, "day")
	) {
		const dayKey = DayKeys[date.day()];
		const dailyTasks = habits
			.filter((habit) => habit.daysOfWeek[dayKey].isTrue)
			.flatMap((habit) => {
				if (!isGoodHabit(habit) || habit.allDay)
					return createTask(habit, date.toISOString());

				return habit.timeOfDay.map(({ time }) => {
					const thisTime = dayjs(time);
					return createTask(
						habit,
						date
							.hour(thisTime.hour())
							.minute(thisTime.minute())
							.second(0)
							.millisecond(0)
							.toISOString()
					);
				});
			});
		tasks.push(...dailyTasks);
	}
	return tasks;
};

export const tasksApi = createApi({
	reducerPath: "tasksApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["Tasks", "DailyTasks", "WeeklyTasks", "TasksByRange"],
	endpoints: (builder) => ({
		getTasksByRange: builder.query<
			Task[],
			{ startDate?: string; endDate?: string } | void
		>({
			queryFn: async ({ startDate, endDate } = {}) => {
				try {
					const start = startDate ?? statsStartDate();
					const end = endDate ?? dayBefore();
					const data = await dbActions.getTasksByRange(start, end);
					return { data };
				} catch (e) {
					return {
						error: { message: `Failed to fetch tasks by date range: ${e}` },
					};
				}
			},
			keepUnusedDataFor: 12 * 60 * 60,
			providesTags: ["TasksByRange"],
		}),
		getDailyTasks: builder.query<Task[], void>({
			queryFn: async () => {
				try {
					const data = await dbActions.getDailyTasks();
					return { data };
				} catch (e) {
					return { error: { message: `Failed to fetch daily tasks: ${e}` } };
				}
			},
			keepUnusedDataFor: 12 * 60 * 60, // 12 hours
			providesTags: ["Tasks", "DailyTasks"],
		}),
		// getWeeklyTasks: builder.query<Task[], string | void>({
		// 	queryFn: async (date) => {
		// 		try {
		// 			const thisDate = date ? new Date(date) : new Date();
		// 			const data = await dbActions.getWeeklyTasks(thisDate);
		// 			return { data };
		// 		} catch (e) {
		// 			return { error: { message: `Failed to fetch weekly tasks: ${e}` } };
		// 		}
		// 	},
		// 	keepUnusedDataFor: 12 * 60 * 60,
		// 	providesTags: ["Tasks", "WeeklyTasks"],
		// }),
		createTestTaskData: builder.mutation({
			queryFn: async ({ startDate, endDate, habits, completionRate }) => {
				try {
					const data = generateTestTasksData(
						habits,
						completionRate,
						startDate,
						endDate
					);
					await dbActions.batchCreateDailyTasks(data);
					return { data };
				} catch (e) {
					return {
						error: {
							message: `Error batch creating task test data. Error: ${e}`,
						},
					};
				}
			},
			invalidatesTags: ["TasksByRange"],
		}),
		createDailyTasks: builder.mutation({
			queryFn: async (habits: Habit[] | Habit) => {
				try {
					if (!Array.isArray(habits)) habits = [habits];
					console.log("createDailyTasks start", habits);
					const tasksToday = generateTasks(habits);
					const data = await dbActions.batchCreateDailyTasks(tasksToday);
					return { data };
				} catch (e) {
					return {
						error: { message: `Error batch creating daily tasks. Error: ${e}` },
					};
				}
			},
			async onQueryStarted(habits, { dispatch, queryFulfilled }) {
				const { data: tasks } = await queryFulfilled;
				dispatch(
					tasksApi.util.updateQueryData("getDailyTasks", undefined, (draft) => {
						tasks?.forEach((task) => {
							draft.push(task);
						});
					})
				);
			},
		}),
		checkOffTask: builder.mutation<Task, Task>({
			queryFn: async (task) => {
				try {
					const data = await dbActions.put("tasks", {
						...task,
						complete: !task.complete,
					});
					return { data };
				} catch (e) {
					return { error: { message: `Error checking off task. Error: ${e}` } };
				}
			},
			invalidatesTags: ["Tasks", "DailyTasks"],
		}),
		incrementCounter: builder.mutation({
			queryFn: async (arg: { task: CounterTask; value?: number }) => {
				try {
					const { task, value = 1 } = arg;
					const data = await dbActions.put("tasks", {
						...task,
						count: task.count + value,
					});
					return { data };
				} catch (e) {
					return { error: { message: `Error incrementing task. Error: ${e}` } };
				}
			},
		}),
		deleteTasks: builder.mutation<void, Task[]>({
			queryFn: async (tasks) => {
				try {
					if (!Array.isArray(tasks)) tasks = [tasks];
					const data = await dbActions.batchDeleteTasks(tasks);
					return { data };
				} catch (e) {
					return {
						error: {
							message: `error batch deleting tasks: ${e}`,
						},
					};
				}
			},
			invalidatesTags: ["Tasks", "DailyTasks", "WeeklyTasks"],
		}),
		deleteAllTasks: builder.mutation<void, Habit>({
			queryFn: async (habit) => {
				try {
					const data = await dbActions.batchDeleteAllTasks(habit);
					return { data };
				} catch (e) {
					return {
						error: {
							message: `error batch deleting all tasks: ${e}`,
						},
					};
				}
			},
			invalidatesTags: ["Tasks", "DailyTasks", "WeeklyTasks"],
		}),
	}),
});

export const {
	useGetTasksByRangeQuery,
	useGetDailyTasksQuery,
	//useGetWeeklyTasksQuery,
	useCreateTestTaskDataMutation,
	useCreateDailyTasksMutation,
	useCheckOffTaskMutation,
	useIncrementCounterMutation,
	useDeleteTasksMutation,
	useDeleteAllTasksMutation,
} = tasksApi;
