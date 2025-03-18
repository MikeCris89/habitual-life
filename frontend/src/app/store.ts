import { configureStore } from "@reduxjs/toolkit";
import { habitsApi } from "../features/habits/habitsApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tasksApi } from "../features/tasks/tasksApi";
import { metaApi } from "../features/meta/metaApi";
import loadingReducer from "../features/loading/loadingSlice";
import statsReducer from "../features/stats/statsSlice";
import modalReducer from "../features/modal/modalSlice";
import timerReducer from "../features/timer/timerSlice";
import calorieReducer from "../features/calories/CaloriesSlice";
import { foodApi } from "../features/calories/food/foodApi";

export const store = configureStore({
	reducer: {
		[habitsApi.reducerPath]: habitsApi.reducer,
		[tasksApi.reducerPath]: tasksApi.reducer,
		[metaApi.reducerPath]: metaApi.reducer,
		[foodApi.reducerPath]: foodApi.reducer,
		loading: loadingReducer,
		modal: modalReducer,
		stats: statsReducer,
		timer: timerReducer,
		calories: calorieReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			habitsApi.middleware,
			tasksApi.middleware,
			metaApi.middleware,
			foodApi.middleware
		),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
