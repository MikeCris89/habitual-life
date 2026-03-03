import { openDB } from "idb";
import {
	dayBefore,
	endOfWeek,
	nextDay,
	startOfDay,
	startOfWeek,
	statsStartDate,
} from "./timeUtils";
import { Habit, Task } from "./types";
import { handleError } from "./errors";
import { MetaData } from "../features/meta/metaApi";

export const dbPromise = openDB("habitsDB", 5, {
	upgrade(db) {
		if (!db.objectStoreNames.contains("habits")) {
			db.createObjectStore("habits", { keyPath: "id" });
		}

		if (!db.objectStoreNames.contains("tasks")) {
			const store = db.createObjectStore("tasks", {
				keyPath: "id",
			});
			store.createIndex("habitId", "habitId", { unique: false });
			store.createIndex("dateTime", "dateTime", { unique: false });
		}
		if (!db.objectStoreNames.contains("meta")) {
			db.createObjectStore("meta", { keyPath: "userId" });
		}
		if (!db.objectStoreNames.contains("errorLogs")) {
			db.createObjectStore("errorLogs", { keyPath: "id", autoIncrement: true });
		}
		if (!db.objectStoreNames.contains("baskets")) {
			db.createObjectStore("baskets", { keyPath: "id" });
		}
		if (!db.objectStoreNames.contains("ingredients")) {
			db.createObjectStore("ingredients", { keyPath: "id" });
		}
		if (!db.objectStoreNames.contains("meals")) {
			db.createObjectStore("meals", { keyPath: "id" });
		}
	},
});

export const dbActions = {
	async setMetaData(data: MetaData) {
		const db = await dbPromise;
		await db.put("meta", data);
	},
	async setTheme(userId: string, theme: string) {
		const db = await dbPromise;
		const metaData = await db.get("meta", userId);
		if (!metaData) {
			handleError("putMetaGoal: No existing meta data.");
		}
		const newData: MetaData = { ...metaData, theme };
		await db.put("meta", newData);
		return newData;
	},
	async setLastCreatedDate(userId: string, date: string = startOfDay()) {
		const db = await dbPromise;
		const existingMeta = await db.get("meta", userId);
		if (!existingMeta) {
			handleError("setLastCreatedDate: No existing meta data.");
		}
		const newData: MetaData = {
			...existingMeta,
			lastCreatedDate: date,
		};
		await db.put("meta", newData);
		return newData;
	},
	async putMetaGoal(userId: string, goal: number) {
		const db = await dbPromise;
		const existingMeta = await db.get("meta", userId);
		if (!existingMeta) {
			handleError("putMetaGoal: No existing meta data.");
		}
		const currGoal = existingMeta.goal;
		currGoal[startOfDay()] = goal;
		const newData: MetaData = {
			...existingMeta,
			goal: { ...currGoal },
		};
		await db.put("meta", newData);
		return newData;
	},
	async put(storeName: string, data: any) {
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
	async getWeeklyTasks(date: string = new Date().toISOString()) {
		const db = await dbPromise;
		const tx = db.transaction("tasks", "readonly");
		const store = tx.objectStore("tasks");
		const index = store.index("dateTime");
		const tasks = [];

		let cursor = await index.openCursor(
			IDBKeyRange.bound(startOfWeek(date), endOfWeek(date), false, true),
		);

		while (cursor) {
			tasks.push(cursor.value);
			cursor = await cursor.continue();
		}

		await tx.done;
		return tasks;
	},
	async getDailyTasks(): Promise<Task[]> {
		const db = await dbPromise;
		const tx = db.transaction("tasks", "readonly");
		const store = tx.objectStore("tasks");
		const index = store.index("dateTime");
		const tasks = [];

		let cursor = await index.openCursor(
			IDBKeyRange.bound(startOfDay(), nextDay(), false, true),
		);

		while (cursor) {
			tasks.push(cursor.value);
			cursor = await cursor.continue();
		}
		await tx.done;

		return tasks;
	},
	async getTasksByRange(
		startDate: string = statsStartDate(),
		endDate: string = dayBefore(),
	): Promise<Task[]> {
		const db = await dbPromise;
		const tx = db.transaction("tasks", "readonly");
		const store = tx.objectStore("tasks");
		const index = store.index("dateTime");
		const tasks = [];

		let cursor = await index.openCursor(
			IDBKeyRange.bound(startOfDay(startDate), nextDay(endDate), false, true),
		);

		while (cursor) {
			tasks.push(cursor.value);
			cursor = await cursor.continue();
		}

		await tx.done;

		return tasks;
	},
	async batchCreateDailyTasks(tasks: Task[]): Promise<Task[]> {
		const db = await dbPromise;
		const tx = db.transaction("tasks", "readwrite");
		const store = tx.objectStore("tasks");
		await Promise.all(tasks.map((task) => store.put(task)));
		await tx.done;
		return tasks;
	},
	async clearBaskets() {
		const db = await dbPromise;
		await db.clear("baskets");
		return true;
	},
	async delete(storeName: string, id: string) {
		const db = await dbPromise;
		const tx = db.transaction(storeName, "readwrite");
		const store = tx.objectStore(storeName);
		store.delete(id);
		await tx.done;
	},
	async batchDeleteTasks(tasks: Task[]) {
		const db = await dbPromise;
		const tx = db.transaction("tasks", "readwrite");
		const store = tx.objectStore("tasks");
		await Promise.all(tasks.map((task) => store.delete(task.id)));
		await tx.done;
	},
	async batchDeleteAllTasksByHabit(habit: Habit) {
		const db = await dbPromise;
		const tx = db.transaction("tasks", "readwrite");
		const store = tx.objectStore("tasks");
		const index = store.index("habitId");

		let cursor = await index.openCursor();

		while (cursor) {
			if (cursor.value.habitId === habit.id) {
				await cursor.delete();
			}
			cursor = await cursor.continue();
		}
		await tx.done;
	},
	async batchDeleteAllTasks(storeName: string) {
		const db = await dbPromise;
		await db.clear(storeName);
		const res = await this.getAll("meta");
		const oldMeta = res[0];
		const newMeta = { ...oldMeta, lastCreatedDate: dayBefore() };
		await this.put("meta", newMeta);
		console.log(`All data cleared from store: ${storeName}`);
	},
	async logError(error: unknown) {
		try {
			const db = await dbPromise;
			const tx = db.transaction("errorLogs", "readwrite");
			const store = tx.objectStore("errorLogs");
			if (error) {
				await store.put({
					timestamp: new Date().toISOString(),
					error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
				});
			}
			await tx.done;
		} catch (e) {
			console.log("error logging error: ", e);
		}
	},
	async deleteAllData() {
		const db = await dbPromise;
		await db.clear("tasks");
		await db.clear("habits");
		await db.clear("baskets");
		await db.clear("ingredients");
		await db.clear("meals");
		await db.clear("meta");
		console.log("All data cleared.");
	},
};
