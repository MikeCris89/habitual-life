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
					return { error: { message: `Failed to fetch weekly tasks: ${e}` } };
				}
			},
			providesTags: ["Tasks"],
		}),
		createDailyTasks: builder.mutation({
			queryFn: async (habits: Habit[] | Habit) => {
				try {
					if (!Array.isArray(habits)) habits = [habits];
					console.log("createDailyTasks start", habits);

					const today = new Date(startOfDay());
					const thisDay = DayKeys[new Date().getDay()];
					const tasksToday = habits
						.filter((habit) => habit.daysOfWeek[thisDay].isTrue)
						.flatMap((habit) => {
							if (!isGoodHabit(habit) || habit.allDay)
								return createTask(habit, startOfDay());

							return habit.timeOfDay.map(({ time }) => {
								return createTask(
									habit,
									new Date(
										today.setHours(
											new Date(time).getHours(),
											new Date(time).getMinutes(),
											0,
											0
										)
									).toISOString()
								);
							});
						});
					console.log("createDailyTasks - tasksToday: ", tasksToday);
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
			invalidatesTags: ["Tasks"],
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
		deleteAllTasks: builder.mutation<void, Habit>({
			queryFn: async (habit) => {
				try {
					const data = await dbActions.batchDeleteTasks(habit);
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
	}),
});

export const {
	useGetDailyTasksQuery,
	useCreateDailyTasksMutation,
	useCheckOffTaskMutation,
	useIncrementCounterMutation,
	useDeleteAllTasksMutation,
} = tasksApi;
