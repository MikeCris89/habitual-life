import { openDB } from "idb";
import { endOfWeek, startOfDay, startOfWeek } from "./timeUtils";
import { Habit, MetaData, Task } from "./types";
import { handleError } from "./errors";

const dbPromise = openDB("habitsDB", 1, {
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
	},
});

export const dbActions = {
	async setMetaData(data: MetaData) {
		const db = await dbPromise;
		await db.put("meta", data);
	},
	async setLastCreatedDate(userId: string) {
		const db = await dbPromise;
		const existingMeta = await db.get("meta", userId);
		if (!existingMeta) {
			handleError("setLastCreatedDate: No existing meta data.");
		}
		const newData = { ...existingMeta, lastCreatedDate: startOfDay() };
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
	async getWeeklyTasks(date: Date = new Date()) {
		const db = await dbPromise;
		const tx = db.transaction("tasks", "readonly");
		const store = tx.objectStore("tasks");
		const index = store.index("dateTime");
		const tasks = [];

		let cursor = await index.openCursor(
			IDBKeyRange.bound(startOfWeek(date), endOfWeek(date), false, true)
		);

		while (cursor) {
			tasks.push(cursor.value);
			cursor = await cursor.continue();
		}

		await tx.done;
		return tasks;
	},
	async getDailyTasks(date: Date) {
		const db = await dbPromise;
		const thisDay = new Date(startOfDay(date));
		const nextDay = new Date(thisDay);
		nextDay.setDate(nextDay.getDate() + 1);
		const tx = db.transaction("tasks", "readonly");
		const store = tx.objectStore("tasks");
		const index = store.index("dateTime");
		const tasks = [];

		let cursor = await index.openCursor(
			IDBKeyRange.bound(startOfDay(date), nextDay.toISOString(), false, true)
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
	async delete(storeName: string, id: string) {
		const db = await dbPromise;
		const tx = db.transaction(storeName, "readwrite");
		const store = tx.objectStore(storeName);
		await store.delete(id);
		await tx.done;
	},
	async batchDeleteTasks(habit: Habit) {
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
};
