import { dbActions } from "./indexedDb";
import { startOfWeek } from "./timeUtils";
import { Habit, WeeklyTasks } from "./types";

export const getHabits = async (): Promise<Habit[]> => {
	const data = await dbActions.getAll("habits");
	return data || [];
};

export const getTasks = async (): Promise<WeeklyTasks | null> => {
	const data = await dbActions.getAll("tasks");
	if (!data.length) return null;
	const weekStart = startOfWeek();
	const newData = data.find(
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

export const setData = async (key: string, data: unknown): Promise<void> => {
	if (data !== undefined && data !== null) {
		const resp = await dbActions.add(key, data);
		return resp;
	}
};
