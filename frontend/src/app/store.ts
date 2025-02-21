import { configureStore } from "@reduxjs/toolkit";
import { habitsApi } from "../features/habits/habitsApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tasksApi } from "../features/tasks/tasksApi";
import { metaApi } from "../features/meta/metaApi";
import loadingReducer from "../features/loading/loadingSlice";
import calendarReducer from "../features/calendar/calendarSlice";

export const store = configureStore({
	reducer: {
		[habitsApi.reducerPath]: habitsApi.reducer,
		[tasksApi.reducerPath]: tasksApi.reducer,
		[metaApi.reducerPath]: metaApi.reducer,
		loading: loadingReducer,
		calendar: calendarReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			habitsApi.middleware,
			tasksApi.middleware,
			metaApi.middleware
		),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
