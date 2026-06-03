import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { dbActions } from "../../utils/indexedDb";
import {
	CounterTask,
	DayKeys,
	Habit,
	HabitTypes,
	isCounterHabit,
	isCounterTask,
	isGoodHabit,
	PresetId,
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

const testWeightCounts = (totalDays: number, day: number) => {
	const startWeight = 250;
	const endWeight = 235;
	const progress = day / totalDays;

	const targetWeight = startWeight - (startWeight - endWeight) * progress;
	const fluctuation = (Math.random() - 0.5) * 1.5;
	const value = targetWeight + fluctuation;

	return parseFloat(value.toFixed(2));
};

const createTask = (habit: Habit, date: string, testCount?: number): Task => {
	const baseTask: TaskBase = {
		title: habit.title,
		habitId: habit.id,
		dateTime: date,
		complete: false,
		id: nanoid(),
	};

	if (isCounterHabit(habit)) {
		const counter = {
			...baseTask,
			type: HabitTypes.COUNTER,
			isMax: habit.isMax,
			total: habit.total,
			count: testCount ?? 0,
		};
		if (habit.id === PresetId.calorieCounter && habit.macros) {
			return {
				...counter,
				macros: habit.macros.map((el) => ({ ...el, count: 0 })),
			};
		}
		return counter;
	}

	if (isGoodHabit(habit)) {
		return {
			...baseTask,
			type: HabitTypes.GOOD,
			allDay: habit.allDay,
			timer: { ...habit.timer },
		};
	}
	const newTask = { ...baseTask, type: habit.type };
	return newTask;
};

export const generateTestTasksData = (
	habits: Habit[],
	completionRate: number,
	startDate: string = startOfDay(),
	endDate: string = nextDay(),
): Task[] => {
	const tasks = [];
	const end = dayjs(endDate);

	for (
		let date = dayjs(startDate), i = 0;
		date.isBefore(end);
		date = date.add(1, "day"), i++
	) {
		const dayKey = DayKeys[date.day()];
		const dailyTasks = habits
			.filter((habit) => habit.daysOfWeek[dayKey].isTrue)
			.flatMap((habit) => {
				if (habit.id === PresetId.weightTracker) {
					const testCount = testWeightCounts(30, i);
					return {
						...createTask(habit, date.toISOString(), testCount),
						complete: Math.random() * 100 <= completionRate,
					};
				}
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
								.toISOString(),
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
	endDate: string = nextDay(),
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
							.toISOString(),
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
	tagTypes: ["Tasks", "DailyTasks", "TasksByRange"],
	endpoints: (builder) => ({
		getTasksByRange: builder.query<
			{ dataArray: Task[]; dataByHabitId: Record<string, Task[]> },
			{
				startDate?: string;
				endDate?: string;
			} | void
		>({
			queryFn: async ({ startDate, endDate } = {}) => {
				try {
					const start = startDate ?? statsStartDate();
					const end = endDate ?? dayBefore();
					const dataArray = await dbActions.getTasksByRange(start, end);
					const dataByHabitId = dataArray.reduce<Record<string, Task[]>>(
						(acc, task) => {
							if (!acc[task.habitId]) acc[task.habitId] = [];
							acc[task.habitId].push(task);
							return acc;
						},
						{},
					);
					return { data: { dataArray, dataByHabitId } };
				} catch (e) {
					return {
						error: { message: `Failed to fetch tasks by date range: ${e}` },
					};
				}
			},
			keepUnusedDataFor: 12 * 60 * 60, // 12 hours
			providesTags: ["Tasks", "TasksByRange"],
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
		createTestTaskData: builder.mutation({
			queryFn: async ({
				startDate,
				endDate,
				habits,
				completionRate,
			}: {
				startDate: string;
				endDate: string;
				habits: Habit[];
				completionRate: number;
			}) => {
				try {
					const data = generateTestTasksData(
						habits,
						completionRate,
						startDate,
						endDate,
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
					const tasksToday = generateTasks(habits);
					const data = await dbActions.batchCreateDailyTasks(tasksToday);
					return { data };
				} catch (e) {
					return {
						error: { message: `Error batch creating daily tasks. Error: ${e}` },
					};
				}
			},
			invalidatesTags: ["Tasks"],
		}),
		editTask: builder.mutation<Task, Task>({
			queryFn: async (task) => {
				try {
					const data = await dbActions.put("tasks", task);
					return { data };
				} catch (e) {
					return { error: { message: `Error editing task. Error: ${e}` } };
				}
			},
			onQueryStarted(task, { dispatch }) {
				dispatch(
					tasksApi.util.updateQueryData("getDailyTasks", undefined, (draft) => {
						let index = draft.findIndex((el) => el.id === task.id);
						if (index !== -1) draft[index] = { ...task };
					}),
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
			async onQueryStarted(task, { dispatch }) {
				dispatch(
					tasksApi.util.updateQueryData("getDailyTasks", undefined, (draft) => {
						const taskToUpdate = draft.find((el) => el.id === task.id);
						if (taskToUpdate) taskToUpdate.complete = !taskToUpdate.complete;
					}),
				);

				dispatch(
					tasksApi.util.updateQueryData(
						"getTasksByRange",
						undefined,
						(draft) => {
							if (!draft) return;

							const taskInArray = draft.dataArray.find(
								(el) => el.id === task.id,
							);
							if (taskInArray) {
								taskInArray.complete = !taskInArray.complete;
							}

							const byHabit = draft.dataByHabitId[task.habitId];
							if (byHabit) {
								const taskInHabit = byHabit.find((el) => el.id === task.id);
								if (taskInHabit) {
									taskInHabit.complete = !taskInHabit.complete;
								}
							}
						},
					),
				);
			},
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
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				const { task, value = 1 } = arg;

				dispatch(
					tasksApi.util.updateQueryData("getDailyTasks", undefined, (draft) => {
						const taskToUpdate = draft.find((el) => el.id === task.id);
						if (taskToUpdate && isCounterTask(taskToUpdate))
							taskToUpdate.count += value;
					}),
				);
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
			invalidatesTags: ["Tasks"],
		}),
		deleteAllTasks: builder.mutation<void, Habit>({
			queryFn: async (habit) => {
				try {
					const data = await dbActions.batchDeleteAllTasksByHabit(habit);
					return { data };
				} catch (e) {
					return {
						error: {
							message: `error batch deleting all tasks: ${e}`,
						},
					};
				}
			},
			invalidatesTags: ["Tasks"],
		}),
	}),
});

export const {
	useGetTasksByRangeQuery,
	useGetDailyTasksQuery,
	useCreateTestTaskDataMutation,
	useCreateDailyTasksMutation,
	useEditTaskMutation,
	useCheckOffTaskMutation,
	useIncrementCounterMutation,
	useDeleteTasksMutation,
	useDeleteAllTasksMutation,
} = tasksApi;
