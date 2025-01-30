import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "../features/habits/habitsSlice";
import tasksReducer from "../features/tasks/tasksSlice";

const store = configureStore({
	reducer: {
		habits: habitsReducer,
		weeklyTasks: tasksReducer,
	},
});

export default store;

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
