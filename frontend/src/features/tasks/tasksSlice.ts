import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	BadTask,
	CounterTask,
	DayKeys,
	GoodTask,
	Habit,
	HabitType,
	isCounterTask,
	isGoodHabit,
	Task,
	WeeklyTasks,
} from "../../utils/types";
import { endOfWeek, startOfDay, startOfWeek } from "../../utils/timeUtils";
import { getTasks } from "../../utils/storageHandler";
import { nanoid } from "nanoid";

const initialState: WeeklyTasks = getTasks() ?? {
	weekStart: startOfWeek(),
	weekEnd: endOfWeek(),
	tasks: {},
	stats: { good: [], bad: [], counter: [] },
	id: nanoid(),
};

const initTask: Task = {
	title: "",
	habitId: "",
	type: "good",
	dateTime: "",
	id: "",
};

const initTypes: Record<HabitType, GoodTask | BadTask | CounterTask> = {
	good: {
		complete: false,
	},
	bad: {
		complete: false,
	},
	counter: {
		minMax: false,
		total: 0,
		count: 0,
		complete: false,
	},
};

type CheckType = {
	id: string;
	value?: number;
};

const createTask = (habit: Habit, date?: string): Task => {
	const task: Task = {
		...initTask,
		...initTypes[habit.type],
		title: habit.title,
		habitId: habit.id,
		type: habit.type,
		dateTime: date ?? "",
		id: nanoid(),
	};

	// if (isGoodHabit(habit) && isGoodTask(task) && habit.timeOfDay.length > 0) {
	// 	task.timeOfDay = habit.timeOfDay[0];
	// }
	return task;
};

const tasksSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		addDailyTasks: (
			state,
			action: PayloadAction<{ habits: Habit[]; date?: string }>
		) => {
			const weekStart = new Date(startOfWeek());
			const today = new Date(startOfDay());
			const { habits, date } = action.payload;

			DayKeys.forEach((day, i) => {
				const thisDay = new Date(
					today.setDate(weekStart.getDate() + i)
				).toISOString();

				if (date && new Date(today) > new Date(date)) return;

				const filteredHabits = habits.filter(
					(habit) => habit.daysOfWeek[day].isTrue
				);
				const tasksThisDay: Task[] = filteredHabits.flatMap((habit) => {
					if (habit && isGoodHabit(habit)) {
						if (habit.timeOfDay.length > 0) {
							return habit.timeOfDay.map((obj) => {
								const thisDate = new Date(thisDay);
								const objDate = new Date(obj.time);
								thisDate.setHours(
									objDate.getHours(),
									objDate.getMinutes(),
									0,
									0
								);
								return createTask(habit, thisDate.toISOString());
							});
						} else if (!habit.timeOfDay || habit.timeOfDay.length === 0) {
							return createTask(habit, thisDay);
						}
					}
					return createTask(habit, thisDay);
				});
				state.tasks[thisDay] = [
					...(state.tasks?.[thisDay] || []),
					...tasksThisDay,
				];
			});
		},
		editTask: (state, action: PayloadAction<Task>) => {
			const thisTask = action.payload;
			if (
				thisTask.dateTime >= state.weekStart &&
				thisTask.dateTime <= state.weekEnd
			) {
				const tasksToday = state.tasks[startOfDay()];

				if (tasksToday) {
					const task = tasksToday.find((task) => task.id === action.payload.id);
					if (task) Object.assign(task, thisTask);
				}
			}
		},
		editDailyTasks: (state, action: PayloadAction<Habit>) => {
			const habit = action.payload;
			Object.keys(state.tasks).forEach((date) => {
				const today = new Date(startOfDay());
				if (today > new Date(date)) return;
				state.tasks[date] = state.tasks[date].filter(
					(task) => !task.complete && task.habitId !== habit.id
				);
			});
			tasksSlice.caseReducers.addDailyTasks(state, {
				payload: { habits: [habit], date: startOfDay() },
				type: "tasks/addDailyTasks",
			});
		},
		checkOff: (state, action: PayloadAction<CheckType>) => {
			const { id, value } = action.payload;
			const task = state.tasks[startOfDay()].find((task) => task.id === id);

			if (task) {
				if (isCounterTask(task) && value) {
					task.count += value;
				} else {
					task.complete = !task.complete;
				}
			}
		},
		// removes all tasks for a single habit
		deleteTasks: (state, action: PayloadAction<Habit>) => {
			const habit = action.payload;
			const newTasks = Object.fromEntries(
				Object.entries(state.tasks).map(([day, tasks]) => [
					day,
					tasks.filter((task) => task.habitId !== habit.id),
				])
			);
			state.tasks = newTasks;
		},
	},
});

export const { addDailyTasks, editTask, checkOff, deleteTasks } =
	tasksSlice.actions;

export default tasksSlice.reducer;
