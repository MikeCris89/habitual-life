import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { dbActions } from "../../utils/indexedDb";
import {
	CounterTask,
	DayKeys,
	Habit,
	isCounterHabit,
	Task,
	TaskBase,
} from "../../utils/types";
import { startOfDay } from "../../utils/timeUtils";
import { nanoid } from "nanoid";

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
			type: habit.type,
			max: habit.max,
			total: habit.total,
			count: 0,
		};
	}
	const newTask = { ...baseTask, type: habit.type };
	return newTask;
};

export const tasksApi = createApi({
	reducerPath: "tasksApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["Tasks"],
	endpoints: (builder) => ({
		getDailyTasks: builder.query<Task[], Date | void>({
			queryFn: async (date) => {
				try {
					const thisDate = date ?? new Date();
					const data = await dbActions.getDailyTasks(thisDate);
					return { data };
				} catch (e) {
					return { error: { message: "Failed to fetch weekly tasks." } };
				}
			},
			providesTags: ["Tasks"],
		}),
		createDailyTasks: builder.mutation<void, Habit[] | Habit>({
			queryFn: async (habits) => {
				try {
					if (!Array.isArray(habits)) habits = [habits];

					const today = new Date(startOfDay());
					const lastDateCreated = await dbActions.getLastCreatedDate();
					if (lastDateCreated === startOfDay()) {
						return { data: undefined };
					}
					const thisDay = DayKeys[new Date().getDay()];
					const tasksToday = habits
						.filter((habit) => habit.daysOfWeek[thisDay].isTrue)
						.flatMap((habit) => {
							return habit.timeOfDay.map(({ time }) =>
								createTask(
									habit,
									new Date(
										today.setHours(
											new Date(time).getHours(),
											new Date(time).getMinutes(),
											0,
											0
										)
									).toISOString()
								)
							);
						});
					await dbActions.batchCreateDailyTasks(tasksToday);
					await dbActions.setLastCreateDate(startOfDay());
					return { data: undefined };
				} catch (e) {
					return {
						error: { message: `Error batch creating daily tasks. Error: ${e}` },
					};
				}
			},
			invalidatesTags: ["Tasks"],
		}),
		checkOffTask: builder.mutation<Task, Task>({
			queryFn: async (task) => {
				try {
					const data = await dbActions.add("tasks", {
						...task,
						complete: !task.complete,
					});
					return { data };
				} catch (e) {
					return { error: { message: `Error checking off task. Error: ${e}` } };
				}
			},
			invalidatesTags: ["Tasks"],
		}),
		incrementCounter: builder.mutation({
			queryFn: async (arg: { task: CounterTask; value?: number }) => {
				try {
					const { task, value = 1 } = arg;
					const data = await dbActions.add("tasks", {
						...task,
						count: task.count + value,
					});
					return { data };
				} catch (e) {
					return { error: { message: `Error incrementing task. Error: ${e}` } };
				}
			},
		}),
		deleteAllTasks: builder.mutation<void, Habit>({
			queryFn: async (habit) => {
				try {
					const data = await dbActions.batchDeleteTasks(habit);
					return { data };
				} catch (e) {
					return {
						error: {
							message: "error batch deleting tasks.",
						},
					};
				}
			},
		}),
	}),
});

export const {
	useGetDailyTasksQuery,
	useCreateDailyTasksMutation,
	useCheckOffTaskMutation,
	useIncrementCounterMutation,
	useDeleteAllTasksMutation,
} = tasksApi;
