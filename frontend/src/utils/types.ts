// export interface Progress {
// 	id: number;
// 	time: string | undefined;
// 	complete: boolean;
// }

export interface TimeOfDay {
	id: number;
	time: string;
}

export interface GoodType {
	timeOfDay: TimeOfDay[];
}
export interface BadType {}
export interface CounterType {
	minMax: boolean;
	total: number;
}

export const HabitTypes = {
	GOOD: "good",
	BAD: "bad",
	COUNTER: "counter",
} as const;

export type HabitType = (typeof HabitTypes)[keyof typeof HabitTypes];

export type Habit =
	| (HabitBase & GoodType)
	| (HabitBase & BadType)
	| (HabitBase & CounterType);

export interface HabitBase {
	title: string;
	daysOfWeek: DaysOfWeek;
	type: HabitType;
	timeOfDay?: TimeOfDay[];
	minMax?: boolean;
	id: string;
	createdAt: string;
}

export interface HabitStats {
	title: string; // to have quick access to title of habit
	id: string; // habit id
	totalTasks: number;
	completeTasks: number;
	totalCount?: number; // total count for counter types
	completeCount?: number; //counter for counter types
}

export interface GoodTask {
	timeOfDay: TimeOfDay;
	complete: boolean;
}
export interface BadTask {
	complete: boolean;
}
export interface CounterTask {
	minMax: boolean;
	total: number;
	count: number;
	complete: boolean;
}

export interface Task {
	title: string;
	id: string;
	type: HabitType;
	habitId: string;
	dateTime: string;
	timeOfDay?: TimeOfDay;
	minMax?: boolean;
	count?: number;
	complete?: boolean;
}

export type Stats = Record<HabitType, HabitStats[]>;

export interface WeeklyTasks {
	weekStart: string;
	weekEnd: string;
	tasks: Record<string, Task[]>; // string is day of week YYYY-MM-DD
	stats: Stats;
	id: string;
}

export interface MonthlyStats {
	monthStart: string;
	monthEnd: string;
	stats: Stats; // calculated for monthly.
	id: string;
}

export interface Day {
	isTrue: boolean;
	label: string;
}

export const DayKeys = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const;

export type DayKey = (typeof DayKeys)[number];

export type DaysOfWeek = Record<DayKey, Day>;

/** TYPEGUARD FUNCTIONS */

export const isDayKey = (name: string): name is DayKey => {
	return DayKeys.includes(name as any);
};

// HABIT TYPES
export const isValidType = (type: string): type is HabitType => {
	return Object.values(HabitTypes).some((entry) => entry === type);
};

export const isGoodHabit = (habit: Habit): habit is HabitBase & GoodType => {
	return habit.type === HabitTypes.GOOD && "timeOfDay" in habit;
};

export const isCounterHabit = (
	habit: Habit
): habit is HabitBase & CounterType => {
	return habit.type === HabitTypes.COUNTER && "minMax" in habit;
};

// TASKS
export const isGoodTask = (task: Task): task is Task & GoodTask => {
	return task.type === HabitTypes.GOOD && "timeOfDay" in task;
};

export const isCounterTask = (task: Task): task is Task & CounterTask => {
	return task.type === HabitTypes.COUNTER && "count" in task;
};
