import { Task } from "./types";
import { startOfDay } from "./timeUtils";

// Current and best run of fully-completed days for a habit's tasks.
// `asOf` anchors the "current" streak to a given day (e.g. the viewed date),
// ignoring any later days — defaults to today.
export const getStreaks = (
	tasks: Task[],
	asOf: string = startOfDay()
): { current: number; best: number } => {
	if (!tasks.length) return { current: 0, best: 0 };

	const refDay = startOfDay(asOf);

	// A calendar day counts as complete only when all its tasks are done.
	const byDay = new Map<string, { total: number; done: number }>();
	tasks.forEach((task) => {
		const day = startOfDay(task.dateTime);
		if (day > refDay) return; // skip days after the reference date
		const entry = byDay.get(day) ?? { total: 0, done: 0 };
		entry.total += 1;
		if (task.complete) entry.done += 1;
		byDay.set(day, entry);
	});

	const days = [...byDay.entries()]
		.map(([day, v]) => ({ day, complete: v.done === v.total }))
		.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

	let best = 0;
	let run = 0;
	days.forEach((d) => {
		run = d.complete ? run + 1 : 0;
		best = Math.max(best, run);
	});

	// Count back from the reference day; an unfinished reference day doesn't break it.
	let current = 0;
	for (let i = days.length - 1; i >= 0; i--) {
		if (days[i].complete) current += 1;
		else if (days[i].day === refDay) continue;
		else break;
	}

	return { current, best };
};

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
