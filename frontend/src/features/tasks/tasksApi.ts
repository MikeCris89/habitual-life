import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query";
import { dbActions } from "../../utils/indexedDb";
import {
	BadTask,
	CounterTask,
	DayKeys,
	GoodTask,
	Habit,
	HabitTypes,
	isCounterHabit,
	Task,
	TaskBase,
	WeeklyTasks,
} from "../../utils/types";
import { endOfWeek, startOfDay, startOfWeek } from "../../utils/timeUtils";
import { nanoid } from "nanoid";

// const initWeekly: WeeklyTasks = {
// 	weekStart: startOfWeek(),
// 	weekEnd: endOfWeek(),
// 	tasks: {},
// 	stats: { good: [], bad: [], counter: [] },
// 	id: nanoid(),
// };

const createTask = (habit: Habit, date: string): Task => {
	const baseTask: TaskBase = {
		title: habit.title,
		habitId: habit.id,
		//type: habit.type,
		dateTime: date,
		complete: false,
		id: nanoid(),
	};

	if (habit.type === HabitTypes.COUNTER) {
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
		fetchDailyTasks: builder.query<Task[], Date>({
			queryFn: async (date = new Date()) => {
				try {
					const data = await dbActions.getDailyTasks(date);
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
					return { data: undefined };
				} catch (e) {
					return {
						error: { message: `Error batch creating dialy tasks. Error: ${e}` },
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
		// newWeeklyTasks: builder.mutation<void, Habit[]>({
		// 	queryFn: async (habits) => {
		// 		const weeklyTasks = { ...initWeekly };
		// 		const weekStart = new Date(startOfWeek());
		// 		const today = new Date(startOfDay());
		// 		habits.forEach((habit) => {
		// 			Object.entries(habit.daysOfWeek).forEach(([day, { isTrue }], i) => {
		// 				if (!isTrue) return;
		// 				const dayIndex = DayKeys.findIndex((el) => el === day);
		// 				const thisDay = new Date(
		// 					today.setDate(weekStart.getDate() + dayIndex)
		// 				);
		// 				if (habit.timeOfDay?.length) {
		// 					habit.timeOfDay.forEach(({ time }) =>
		// 						weeklyTasks.tasks[thisDay.toISOString()].push(
		// 							createTask(
		// 								habit,
		// 								new Date(
		// 									thisDay.setHours(
		// 										new Date(time).getHours(),
		// 										new Date(time).getMinutes(),
		// 										0,
		// 										0
		// 									)
		// 								).toISOString()
		// 							)
		// 						)
		// 					);
		// 				} else {
		// 					weeklyTasks.tasks[thisDay.toISOString()].push(
		// 						createTask(habit, thisDay.toISOString())
		// 					);
		// 				}
		// 			});
		// 		});
		// 		await dbActions.add("weeklyTasks", weeklyTasks);
		// 	},
		// 	invalidatesTags: ["Tasks"],
		// }),
	}),
});
