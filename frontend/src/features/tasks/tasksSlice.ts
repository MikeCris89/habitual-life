import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	DayKeys,
	Habit,
	isCounterHabit,
	isCounterTask,
	isGoodHabit,
	Task,
	WeeklyTasks,
} from "../../utils/types";
import { endOfWeek, startOfDay, startOfWeek } from "../../utils/timeUtils";
import { getTasks } from "../../utils/storageHandler";
import { nanoid } from "nanoid";

const initTask: Task = {
	title: "",
	habitId: "",
	type: "good",
	dateTime: "",
	id: "",
	complete: false,
};

const initialState: WeeklyTasks = getTasks() ?? {
	weekStart: startOfWeek(),
	weekEnd: endOfWeek(),
	tasks: {},
	stats: { good: [], bad: [], counter: [] },
	id: nanoid(),
};

const createTask = (habit: Habit, date: string): Task => {
	const task: Task = {
		...initTask,
		title: habit.title,
		habitId: habit.id,
		type: habit.type,
		dateTime: date,
		id: nanoid(),
	};

	if (isCounterHabit(habit)) {
		task.total = habit.total;
		task.minMax = habit.minMax;
		task.count = 0;
	}
	return task;
};

const modifyTasks = (
	dailyTasks: Record<string, Task[]>,
	f: (task: Task[]) => Task[]
) => {
	return Object.fromEntries(
		Object.entries(dailyTasks).map(([day, tasks]) => [day, f(tasks)])
	);
};

const tasksSlice = createSlice({
	name: "weeklyTasks",
	initialState,
	reducers: {
		addDailyTasks: (
			state,
			action: PayloadAction<{ habits: Habit[]; date?: string }>
		) => {
			const weekStart = new Date(startOfWeek());
			const today = new Date(startOfDay());
			const { habits, date } = action.payload;

			// loop through each day of week
			DayKeys.forEach((day, i) => {
				const thisDay = new Date(
					today.setDate(weekStart.getDate() + i)
				).toISOString();

				// if date object is passed
				if (date && new Date(today) > new Date(date)) return;

				// habits that have tasks for today
				const filteredHabits = habits.filter(
					(habit) => habit.daysOfWeek[day].isTrue
				);

				// create tasks for each habit for this day, store in weeklyTasks.tasks
				const tasksThisDay: Task[] = filteredHabits.flatMap((habit) => {
					if (habit && isGoodHabit(habit)) {
						if (habit.timeOfDay.length > 0) {
							return habit.timeOfDay.map((obj) => {
								const thisDate = new Date(thisDay);
								const objDate = new Date(obj.time || startOfDay());

								thisDate.setHours(
									objDate.getHours(),
									objDate.getMinutes(),
									0,
									0
								);
								return createTask(habit, thisDate.toISOString());
							});
						} else if (!habit.timeOfDay || !habit.timeOfDay.length) {
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
				thisTask.dateTime < state.weekEnd
			) {
				state.tasks = modifyTasks(state.tasks, (tasks) =>
					tasks.map((task) => (task.id === action.payload.id ? thisTask : task))
				);
			}
		},
		editDailyTasks: (state, action: PayloadAction<Habit>) => {
			const habit = action.payload;
			state.tasks = modifyTasks(state.tasks, (tasks) =>
				tasks.filter(
					(task) =>
						task.habitId !== habit.id &&
						!task.complete &&
						task.dateTime > new Date().toISOString()
				)
			);
			tasksSlice.caseReducers.addDailyTasks(state, {
				payload: { habits: [habit], date: startOfDay() },
				type: "tasks/addDailyTasks",
			});
		},
		checkOff: (state, action: PayloadAction<Task>) => {
			state.tasks = modifyTasks(state.tasks, (tasks) =>
				tasks.map((task) =>
					task.id === action.payload.id
						? { ...task, complete: !task.complete }
						: task
				)
			);
		},
		increment: (
			state,
			action: PayloadAction<{ thisTask: Task; value?: number }>
		) => {
			const { thisTask, value } = action.payload;
			if (isCounterTask(thisTask)) {
				state.tasks = modifyTasks(state.tasks, (tasks) =>
					tasks.map((task) =>
						task.id === thisTask.id
							? {
									...task,
									count: value ? thisTask.count + value : thisTask.count + 1,
							  }
							: task
					)
				);
			}
		},
		// removes all tasks for a single habit, this week only
		deleteTasks: (state, action: PayloadAction<Habit>) => {
			const habit = action.payload;
			state.tasks = modifyTasks(state.tasks, (tasks) =>
				tasks.filter((task) => task.habitId !== habit.id)
			);
		},
	},
});

export const { addDailyTasks, editTask, checkOff, deleteTasks, increment } =
	tasksSlice.actions;

export default tasksSlice.reducer;
