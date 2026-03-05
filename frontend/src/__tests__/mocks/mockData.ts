import { startOfDay } from "../../utils/timeUtils";
import {
	DaysOfWeek,
	GoodType,
	BadType,
	HabitTypes,
	TimerTypes,
	GoodTask,
	SingleTimer,
	RoundTimer,
} from "../../utils/types";

// HABITS

const allDays: DaysOfWeek = {
	Sunday: { isTrue: true, label: "S" },
	Monday: { isTrue: true, label: "M" },
	Tuesday: { isTrue: true, label: "T" },
	Wednesday: { isTrue: true, label: "W" },
	Thursday: { isTrue: true, label: "T" },
	Friday: { isTrue: true, label: "F" },
	Saturday: { isTrue: true, label: "S" },
};

const weekdaysOnly: DaysOfWeek = {
	Sunday: { isTrue: false, label: "S" },
	Monday: { isTrue: true, label: "M" },
	Tuesday: { isTrue: true, label: "T" },
	Wednesday: { isTrue: true, label: "W" },
	Thursday: { isTrue: true, label: "T" },
	Friday: { isTrue: true, label: "F" },
	Saturday: { isTrue: false, label: "S" },
};

export const mockGoodHabitAllDay: GoodType = {
	id: "habit-1",
	title: "Morning Walk",
	type: HabitTypes.GOOD,
	daysOfWeek: allDays,
	createdAt: new Date().toISOString(),
	allDay: true,
	timeOfDay: [],
	timer: { type: TimerTypes.NONE },
};

export const mockGoodHabitWithTimes: GoodType = {
	id: "habit-2",
	title: "Exercise",
	type: HabitTypes.GOOD,
	daysOfWeek: weekdaysOnly,
	createdAt: new Date().toISOString(),
	allDay: false,
	timeOfDay: [
		{ id: 0, time: new Date("2024-01-01T08:00:00").toISOString() },
		{ id: 1, time: new Date("2024-01-01T18:00:00").toISOString() },
	],
	timer: { type: TimerTypes.NONE },
};

export const mockBadHabit: BadType = {
	id: "habit-3",
	title: "No Junk Food",
	type: HabitTypes.BAD,
	daysOfWeek: allDays,
	createdAt: new Date().toISOString(),
};

// TASKS

const today = startOfDay();

export const mockTasks: GoodTask[] = [
	{
		id: "task-1",
		habitId: "habit-1",
		title: "Morning Walk",
		dateTime: today,
		complete: true,
		type: "good",
		allDay: true,
		timer: { type: TimerTypes.NONE },
	},
	{
		id: "task-2",
		habitId: "habit-1",
		title: "Morning Walk",
		dateTime: today,
		complete: true,
		type: "good",
		allDay: true,
		timer: { type: TimerTypes.NONE },
	},
	{
		id: "task-3",
		habitId: "habit-2",
		title: "Exercise",
		dateTime: today,
		complete: false,
		type: "good",
		allDay: true,
		timer: { type: TimerTypes.NONE },
	},
];

// TIMERS

export const mockSingleTimer: SingleTimer = {
	type: TimerTypes.SINGLE,
	duration: 300000, // 5 minutes in ms
};

export const mockRoundTimer: RoundTimer = {
	type: TimerTypes.ROUND,
	duration: 60000,
	rounds: 3,
	sets: 2,
	breakDuration: 30000,
};
