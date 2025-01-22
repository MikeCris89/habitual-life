import { createContext, useContext, useEffect, useState } from "react";

import { getHabits, setData } from "../utils/storageHandler";
import { Habit } from "../utils/types";

interface ContextType {
	habits: Habit[];
	addHabit: (habit: Habit) => void;
	getHabit: (id: string) => Habit | undefined;
	loading: boolean;
}

const HabitContext = createContext<ContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
		const data: Habit[] = getHabits();
		setHabits(data);
		setLoading(false);
	}, []);

	const addHabit = (newHabit: Habit) => {
		const newHabits: Habit[] = [
			...habits,
			{ ...newHabit, id: Date.now().toString() },
		];
		setData("habits", newHabits);
		setHabits(newHabits);
	};

	const getHabit = (id: string): Habit | undefined => {
		console.log(habits);
		let resp;
		if (habits.length > 0) {
			console.log("habit length > 0", habits);
			resp = habits.find((habit) => habit.id === id);
			if (!resp) throw new Error(`Error finding habit by id: ${id}`);
			return resp;
		}
		return undefined;
	};

	return (
		<HabitContext.Provider value={{ habits, addHabit, getHabit, loading }}>
			{children}
		</HabitContext.Provider>
	);
};

export const useHabits = () => {
	const context = useContext(HabitContext);
	if (!context) throw new Error("Context failed.");
	return context;
};
