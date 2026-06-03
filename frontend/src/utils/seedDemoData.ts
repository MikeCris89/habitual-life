import { nanoid } from "nanoid";
import { MetaData } from "../features/meta/metaApi";
import { dbActions } from "./indexedDb";
import { startOfDay, statsStartDate } from "./timeUtils";
import { getDefaultHabits } from "../data/defaultHabits";
import { generateTestTasksData } from "../features/tasks/tasksApi";

export const seedDemoDataIfEmpty = async () => {
	const meta = await dbActions.getAll("meta");
	if (meta && meta.length) return; // idempotent — only first launch

	const metaInit: MetaData = {
		userId: nanoid(),
		lastCreatedDate: "", // let the live flow create today
		theme: "dark",
		goal: { [startOfDay()]: 70 },
		hasSeenTutorial: false,
	};
	await dbActions.setMetaData(metaInit);

	const habits = getDefaultHabits();
	await dbActions.batchCreateDefaultHabits(habits);

	const tasks = generateTestTasksData(
		habits,
		70,
		statsStartDate(),
		startOfDay(),
	);
	await dbActions.batchCreateDailyTasks(tasks);
};
