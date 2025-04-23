import { Task } from "./types";

//Convert string to number - only number ch & .
export const stringToNum = (value: string): number => {
	const num = value.replace(/[^0-9.]/g, "");
	const cleaned = num.split(".").length > 2 ? num.replace(/\.+$/, "") : num;
	return cleaned === "" ? 0 : Number(cleaned);
};

// Clean number as a string - only number ch & .
export const numberString = (value: string): string => {
	const num = value.replace(/[^0-9.]/g, "");
	const cleaned = num.split(".").length > 2 ? num.replace(/\.+$/, "") : num;

	return cleaned;
};

// Get Completion Rate for task and task history
export const getCompletionRate = (pastTasks: Task[], task: Task) => {
	const totalTasks = pastTasks.length + 1;
	const completed =
		pastTasks.filter((el) => el.complete).length + (task.complete ? 1 : 0);

	return Math.round((completed / totalTasks) * 100);
};

export const getMaxNumFromObjArr = <T extends Record<string, any>>(
	arr: T[],
	field: keyof T,
	initValue: number = 0
): number => {
	return arr.reduce((acc, entry) => {
		const value = Number(entry[field]);
		return isNaN(value) ? acc : Math.max(acc, value);
	}, initValue);
};

export const formatLabel = (
	label: string,
	dropLastChar: boolean = false
): string => {
	if (!label) return "";
	const formatted = label[0].toUpperCase() + label.slice(1);
	return dropLastChar ? formatted.slice(0, -1) : formatted;
};

export const getGraphCompRate = (
	allTasks: Task[]
): { date: string; value: number }[] => {
	let rate = 0;
	return [...allTasks]
		.sort(
			(a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
		)
		.map((el, i) => {
			rate += el.complete ? 1 : 0;
			const value = Math.round((rate / (i + 1)) * 100);
			return { date: el.dateTime, value };
		});
};
