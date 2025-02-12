import { Habit, WeeklyTasks } from "./../../utils/types";
import { dbActions } from "../../utils/indexedDb";
import { startOfWeek } from "../../utils/timeUtils";

export const getHabitsOld = async (): Promise<Habit[]> => {
	const data = await dbActions.getAll("habits");
	return data || [];
};

export const getTasksOld = async (): Promise<WeeklyTasks | null> => {
	const data = await dbActions.getAll("weeklyTasks");
	if (!data.length) return null;
	const weekStart = startOfWeek();
	const newData = data.find(
		(week: WeeklyTasks) =>
			weekStart >= week.weekStart && weekStart < week.weekEnd
	);
	return newData;
};

// export const setTasks = (weeklyTasks: WeeklyTasks) => {
// 	const storage = localStorage.getItem("weeklyTasks");
// 	let allTasks = storage ? JSON.parse(storage) : [];
// 	const existingWeek = allTasks.find(
// 		(week: WeeklyTasks) => week.id === weeklyTasks.id
// 	);
// 	if (!existingWeek) {
// 		allTasks.push(weeklyTasks);
// 	} else {
// 		allTasks = allTasks.map((week: WeeklyTasks) =>
// 			week.id === weeklyTasks.id ? weeklyTasks : week
// 		);
// 	}
// 	localStorage.setItem("weeklyTasks", JSON.stringify(allTasks));
// };

export const setDataOld = async (key: string, data: unknown): Promise<void> => {
	if (data !== undefined && data !== null) {
		await dbActions.add(key, data);
	}
};

export const deleteDataOld = async (key: string, id: string): Promise<void> => {
	if (id) {
		await dbActions.delete(key, id);
	}
};
