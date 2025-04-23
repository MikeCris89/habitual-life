// Preset Id's
export const PresetId = {
	calorieCounter: "preset_calories",
	weightTracker: "preset_weight",
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
	label: string;
	total: number;
	unit: string;
	type: string;
	active: boolean;
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

// Calories - Ingrdients - Meals
export const Units = [
	"unit", // Generic unit (e.g., 1 slice, 1 piece, 1 stick, etc.)
	"g", // Grams
	"mg", // Milligrams
	"tbsp", // Tablespoons
	"tsp", // Teaspoons
	"cup", // Cups
	"kg", // Kilograms
	"lb", // Pounds
	"oz", // Ounces
	"L", // Liters
	"ml", // Milliliters
	"fl oz", // Fluid Ounces
] as const;

export type UnitTypes = (typeof Units)[number];

export const FOOD_CATEGORIES = {
	INGREDIENTS: "ingredients",
	MEALS: "meals",
	CUSTOM: "custom",
} as const;

export type FoodCategory =
	(typeof FOOD_CATEGORIES)[keyof typeof FOOD_CATEGORIES];

export interface FoodBase {
	title: string;
	description: string;
	id: string;
}

export interface NutritionalInfo {
	calories: number;
	macros: Record<string, number>;
}

export interface CustomForm extends NutritionalInfo {
	qty: number;
	id: string;
}

export interface IngredientForm extends FoodBase, NutritionalInfo {
	source: Exclude<FoodCategory, "custom">;
	servingSize: { serving: number; units: UnitTypes };
}

export interface MealForm extends FoodBase {
	ingredients: BasketItems[];
}

export type FoodFormTypes = CustomForm | IngredientForm | MealForm;

export type FoodFormKeys = keyof (CustomForm & IngredientForm & MealForm);

export interface BasketItems {
	id: string;
	qty: number;
}

export interface Baskets {
	time: string;
	ingredients: BasketItems[];
	meals: BasketItems[];
	custom: CustomForm[];
	id: string;
}

export const getFoodCategory = (log: FoodFormTypes): FoodCategory => {
	if ("source" in log && "servingSize" in log)
		return FOOD_CATEGORIES.INGREDIENTS;
	if ("ingredients" in log) return FOOD_CATEGORIES.MEALS;
	return FOOD_CATEGORIES.CUSTOM;
};

export const isIngOrCustom = (
	log: FoodFormTypes | null
): log is CustomForm | IngredientForm => {
	return log != null && "calories" in log;
};

export const isValidKey = <T extends object>(
	obj: T,
	key: PropertyKey
): key is keyof T => key in obj;

export const isIngredientLog = (log: unknown): log is IngredientForm =>
	typeof log === "object" &&
	log !== null &&
	"servingSize" in log &&
	"source" in log;

export const isMealLog = (log: unknown): log is MealForm =>
	typeof log === "object" && log !== null && "ingredients" in log;

export const isCustomLog = (log: unknown): log is CustomForm =>
	!isIngredientLog(log) && !isMealLog(log);

export const isMealSource = (item: IngredientForm) =>
	item.source === FOOD_CATEGORIES.MEALS;

// Stats
type Stats = Record<HabitType, HabitStats[]>;

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

/** BRANDED TYPES */

export type NonNegativeNum = {
	readonly __nonNegative?: unique symbol;
};

export const ensureNonNegative = (num: number): NonNegativeNum =>
	Math.min(num, 0) as NonNegativeNum;

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
