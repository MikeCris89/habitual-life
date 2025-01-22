import { startOfWeek } from "./timeUtils";
import { Habit, WeeklyTasks } from "./types";

export const getHabits = (): Habit[] => {
	const data = localStorage.getItem("habits");
	return data ? JSON.parse(data) : [];
};

export const getTasks = (): WeeklyTasks | null => {
	const data = localStorage.getItem("tasks");
	if (!data) return null;
	const parsed = JSON.parse(data);
	const weekStart = startOfWeek();
	const newData = parsed.find(
		(week: WeeklyTasks) =>
			weekStart >= week.weekStart && weekStart < week.weekEnd
	);
	return newData;
};

export const setTasks = (weeklyTasks: WeeklyTasks) => {
	const storage = localStorage.getItem("tasks");
	let allTasks = storage ? JSON.parse(storage) : [];
	const existingWeek = allTasks.find(
		(week: WeeklyTasks) => week.id === weeklyTasks.id
	);
	if (!existingWeek) {
		allTasks.push(weeklyTasks);
	} else {
		allTasks = allTasks.map((week: WeeklyTasks) =>
			week.id === weeklyTasks.id ? weeklyTasks : week
		);
	}
	localStorage.setItem("tasks", JSON.stringify(allTasks));
};

export const setData = (key: string, data: unknown): void => {
	if (data !== undefined && data !== null)
		localStorage.setItem(key, JSON.stringify(data));
};
