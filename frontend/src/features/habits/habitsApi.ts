import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Habit } from "../../utils/types";
import { dbActions } from "../../utils/indexedDb";
import { handleError } from "../../utils/errors";

export const habitsApi = createApi({
	reducerPath: "habitsApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["Habits"],
	endpoints: (builder) => ({
		getHabits: builder.query<Habit[], void>({
			queryFn: async () => {
				try {
					const data = (await dbActions.getAll("habits")) ?? [];
					return { data };
				} catch (error) {
					return {
						error: {
							status: "Custom_Error",
							message: `Failed to fetch habits.`,
						},
					};
				}
			},
			keepUnusedDataFor: 12 * 60 * 60,
			providesTags: ["Habits"],
		}),
		addHabit: builder.mutation<Habit, Habit>({
			queryFn: async (newHabit) => {
				try {
					await dbActions.put("habits", newHabit);
					return { data: newHabit };
				} catch (e) {
					return {
						error: { status: "Custom_Error", message: "Error adding habit." },
					};
				}
			},
			async onQueryStarted(newHabit, { dispatch, queryFulfilled }) {
				try {
					const { data: addedHabit } = await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData("getHabits", undefined, (draft) => {
							draft.push(addedHabit);
						})
					);
				} catch (e) {
					handleError(`Failed to update cache on addHabit. Error: ${e}`);
				}
			},
		}),
		editHabit: builder.mutation<Habit, Habit>({
			queryFn: async (habit) => {
				try {
					await dbActions.put("habits", habit);
					return { data: habit };
				} catch (e) {
					return {
						error: { status: "Custom_Error", message: "Error editing habit." },
					};
				}
			},
			async onQueryStarted(habit, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedHabit } = await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData("getHabits", undefined, (draft) => {
							const index = draft.findIndex(
								(habit) => habit.id === updatedHabit.id
							);
							if (index === -1)
								handleError(
									"editHabit - onQueryStarted: Failed to find index for habit"
								);
							draft[index] = updatedHabit;
						})
					);
				} catch (e) {
					handleError(`Failed to edit habit. Error: ${e}`);
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
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				try {
					const { data: deleteId } = await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData("getHabits", undefined, (draft) => {
							const index = draft.findIndex((habit) => habit.id === deleteId);
							if (index === -1)
								handleError(
									"deleteHabit - onQueryStarted: Failed to find index for habit."
								);
							draft.splice(index, 1);
						})
					);
				} catch (e) {
					handleError(`Failed to delete habit. Error: ${e}`);
				}
			},
		}),
	}),
});

export const {
	useGetHabitsQuery,
	useLazyGetHabitsQuery,
	useAddHabitMutation,
	useEditHabitMutation,
	useDeleteHabitMutation,
} = habitsApi;
