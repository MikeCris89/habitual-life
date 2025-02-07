import { openDB } from "idb";
import { endOfWeek, startOfDay, startOfWeek } from "./timeUtils";
import { Task } from "./types";

const dbPromise = openDB("habitsDB", 1, {
	upgrade(db) {
		if (!db.objectStoreNames.contains("habits")) {
			db.createObjectStore("habits", { keyPath: "id" });
		}

		if (!db.objectStoreNames.contains("tasks")) {
			db.createObjectStore("tasks", { keyPath: "id" });
		}
	},
});

export const dbActions = {
	async add(storeName: string, data: any) {
		const db = await dbPromise;
		const tx = db.transaction(storeName, "readwrite");
		const store = tx.objectStore(storeName);
		await store.put(data);
		await tx.done;
		return data;
	},
	async get(storeName: string, id: string) {
		const db = await dbPromise;
		return await db.get(storeName, id);
	},
	async getAll(storeName: string) {
		const db = await dbPromise;
		return await db.getAll(storeName);
	},
	async getWeeklyTasks(date: Date = new Date()) {
		const db = await dbPromise;
		const weekStart = startOfWeek(date);
		const weekEnd = endOfWeek(date);
		const allTasks = await db.getAll("tasks");
		return allTasks.filter(
			(task) => task.date >= weekStart && task.date < weekEnd
		);
	},
	async getDailyTasks(date: Date = new Date()) {
		const db = await dbPromise;
		const thisDay = new Date(startOfDay(date));
		const nextDay = new Date(thisDay.getDate() + 1);
		const allTasks = await db.getAll("tasks");
		return allTasks.filter(
			(task) => task.date >= thisDay && task.date < nextDay
		);
	},
	async batchCreateDailyTasks(tasks: Task[]) {
		const db = await dbPromise;
		const tx = db.transaction("tasks", "readwrite");
		const store = tx.objectStore("tasks");
		await Promise.all(tasks.map((task) => store.put(task)));
		await tx.done;
	},
	async delete(storeName: string, id: string) {
		const db = await dbPromise;
		const tx = db.transaction(storeName, "readwrite");
		const store = tx.objectStore(storeName);
		await store.delete(id);
		await tx.done;
	},
};
