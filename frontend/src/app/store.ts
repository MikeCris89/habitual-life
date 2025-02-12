import { configureStore } from "@reduxjs/toolkit";
import { habitsApi } from "../features/habits/habitsApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tasksApi } from "../features/tasks/tasksApi";

export const store = configureStore({
	reducer: {
		[habitsApi.reducerPath]: habitsApi.reducer,
		[tasksApi.reducerPath]: tasksApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(habitsApi.middleware, tasksApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
