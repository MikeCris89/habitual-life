import { Habit, DayKey, DayKeys, DaysOfWeek, PresetId } from "../utils/types";
import { statsStartDate } from "../utils/timeUtils";

const DAY_LABELS: Record<DayKey, string> = {
	Sunday: "S",
	Monday: "M",
	Tuesday: "T",
	Wednesday: "W",
	Thursday: "T",
	Friday: "F",
	Saturday: "S",
};

const days = (active: DayKey[]): DaysOfWeek =>
	Object.fromEntries(
		DayKeys.map((d) => [
			d,
			{ isTrue: active.includes(d), label: DAY_LABELS[d] },
		]),
	) as DaysOfWeek;

const everyDay = () => days([...DayKeys]);

// Build a valid ISO timestamp; only the time portion is read by the UI.
const at = (h: number, m: number) =>
	new Date(2024, 0, 1, h, m, 0, 0).toISOString();

export const getDefaultHabits = (): Habit[] => {
	const createdAt = statsStartDate(); // matches demo history start

	return [
		{
			type: "good",
			title: "Read",
			id: "habit-read",
			createdAt,
			daysOfWeek: everyDay(),
			allDay: true,
			timeOfDay: [],
			timer: { type: "none" },
		},
		{
			type: "good",
			title: "Meditate",
			id: "habit-meditate",
			createdAt,
			daysOfWeek: everyDay(),
			allDay: false,
			timeOfDay: [{ id: 1, time: at(7, 30) }],
			timer: { type: "single", duration: 600000 },
		},
		{
			type: "good",
			title: "HIIT workout",
			id: "habit-hiit",
			createdAt,
			daysOfWeek: days([DayKeys[1], DayKeys[3], DayKeys[5]]),
			allDay: false,
			timeOfDay: [{ id: 1, time: at(18, 0) }],
			timer: {
				type: "round",
				duration: 30000,
				rounds: 8,
				sets: 3,
				breakDuration: 60000,
			},
		},
		{
			type: "good",
			title: "Walk",
			id: "habit-walk",
			createdAt,
			daysOfWeek: everyDay(),
			allDay: false,
			timeOfDay: [
				{ id: 1, time: at(8, 0) },
				{ id: 2, time: at(20, 0) },
			],
			timer: { type: "none" },
		},
		{
			type: "bad",
			title: "Smoking",
			id: "habit-smoking",
			createdAt,
			daysOfWeek: everyDay(),
		},
		{
			type: "counter",
			title: "Calories",
			id: PresetId.calorieCounter,
			createdAt,
			daysOfWeek: everyDay(),
			isMax: true,
			total: 2400,
			macros: [
				{
					id: "protein",
					label: "Protein",
					total: 180,
					unit: "g",
					type: "protein",
					active: true,
				},
				{
					id: "carbs",
					label: "Carbs",
					total: 240,
					unit: "g",
					type: "carbs",
					active: true,
				},
				{
					id: "fat",
					label: "Fat",
					total: 70,
					unit: "g",
					type: "fat",
					active: true,
				},
			],
		},
		{
			type: "counter",
			title: "Weight Tracker",
			id: "preset_weight",
			createdAt,
			daysOfWeek: everyDay(),
			isMax: false,
			total: 0,
		},
	];
};
