// Preset Id's
export const PresetId = {
	calorieCounter: "preset_calories",
} as const;

// Timers
export interface NoneTimer {
	type: "none";
}

export interface SingleTimer {
	type: "single";
	duration: number;
}

export interface RoundTimer {
	type: "round";
	duration: number;
	rounds: number;
	sets: number;
	breakDuration: number;
}

export type Timer = SingleTimer | RoundTimer | NoneTimer;

// Habits
export const HabitTypes = {
	GOOD: "good",
	BAD: "bad",
	COUNTER: "counter",
} as const;

export type HabitType = (typeof HabitTypes)[keyof typeof HabitTypes];

export const TimerTypes = {
	SINGLE: "single",
	ROUND: "round",
	NONE: "none",
} as const;

export type TimerType = (typeof TimerTypes)[keyof typeof TimerTypes];

export interface HabitBase {
	title: string;
	daysOfWeek: DaysOfWeek;
	id: string;
	createdAt: string;
}

export interface TimeOfDay {
	id: number;
	time: string;
}

export interface GoodType extends HabitBase {
	type: "good";
	timeOfDay: TimeOfDay[];
	allDay: boolean;
	timer: Timer;
}

export interface BadType extends HabitBase {
	type: "bad";
}

export interface MacrosType {
	title: string;
	total: number;
	units: string;
	id: string;
}

export interface CounterType extends HabitBase {
	type: "counter";
	isMax: boolean;
	total: number;
	macros?: MacrosType[];
}

export type Habit = GoodType | BadType | CounterType;

// Tasks
export interface TaskBase {
	title: string;
	id: string;
	habitId: string;
	dateTime: string;
	complete: boolean;
}

export interface GoodTask extends TaskBase {
	type: "good";
	allDay: boolean;
	timer: Timer;
}

export interface BadTask extends TaskBase {
	type: "bad";
}

export interface MacrosTask extends MacrosType {
	count: number;
}

export interface CounterTask extends TaskBase {
	type: "counter";
	isMax: boolean;
	total: number;
	count: number;
	macros?: MacrosTask[];
}

export type Task = GoodTask | BadTask | CounterTask;

// Stats
export type Stats = Record<HabitType, HabitStats[]>;

export interface HabitStats {
	title: string; // to have quick access to title of habit
	id: string;
	totalTasks: number;
	completeTasks: number;
	totalCount?: number; // total count for counter types
	completeCount?: number; //counter for counter types
}

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

// TIMER TYPES
export const isTimerType = (name: string): name is TimerType => {
	return Object.values(TimerTypes).includes(name as any);
};

export const isNoneTimer = (timer: Timer): timer is NoneTimer => {
	return !!timer?.type && timer.type === TimerTypes.NONE;
};

export const isSingleTimer = (timer: Timer): timer is SingleTimer => {
	return timer.type === TimerTypes.SINGLE;
};

export const isRoundTimer = (timer: Timer): timer is RoundTimer => {
	return timer.type === TimerTypes.ROUND;
};

// HABIT TYPES
export const isValidHabitType = (type: string): type is HabitType => {
	return Object.values(HabitTypes).some((entry) => entry === type);
};

export const isGoodHabit = (habit: Habit): habit is GoodType => {
	return habit.type === HabitTypes.GOOD;
};

export const isCounterHabit = (habit: Habit): habit is CounterType => {
	return habit.type === HabitTypes.COUNTER;
};

export const isBadHabit = (habit: Habit): habit is BadType => {
	return habit.type === HabitTypes.BAD;
};

// TASK TYPES
export const isGoodTask = (task: Task): task is GoodTask => {
	return task.type === HabitTypes.GOOD;
};

export const isCounterTask = (task: Task): task is CounterTask => {
	return task.type === HabitTypes.COUNTER;
};

export const isBadTask = (task: Task): task is BadTask => {
	return task.type === HabitTypes.BAD;
};
