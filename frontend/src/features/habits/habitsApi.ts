import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Habit } from "../../utils/types";
import { dbActions } from "../../utils/indexedDb";

export const habitsApi = createApi({
	reducerPath: "habitsApi",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => ({
		getHabits: builder.query<Habit[], void>({
			queryFn: async () => {
				try {
					const data = await dbActions.getAll("habits");
					return { data };
				} catch (error) {
					return {
						error: {
							status: "Custom_Error",
							message: "Failed to fetch habits.",
						},
					};
				}
			},
		}),
		addHabit: builder.mutation<Habit, Habit>({
			queryFn: async (newHabit) => {
				try {
					await dbActions.add("habits", newHabit);
					return { data: newHabit };
				} catch (e) {
					return {
						error: { status: "Custom_Error", message: "Error adding habit." },
					};
				}
			},
		}),
		editHabit: builder.mutation<Habit, Habit>({
			queryFn: async (habit) => {
				try {
					await dbActions.add("habits", habit);
					return { data: habit };
				} catch (e) {
					return {
						error: { status: "Custom_Error", message: "Error editing habit." },
					};
				}
			},
		}),
		deleteHabit: builder.mutation<string, string>({
			queryFn: async (id) => {
				try {
					await dbActions.delete("habits", id);
					return { data: id };
				} catch (e) {
					return {
						error: { status: "Custom_Error", message: "Error deleting habit." },
					};
				}
			},
		}),
	}),
});

export const {
	useGetHabitsQuery,
	useAddHabitMutation,
	useEditHabitMutation,
	useDeleteHabitMutation,
} = habitsApi;
