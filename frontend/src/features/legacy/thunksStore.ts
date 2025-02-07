import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./habitsSlice";
import tasksReducer from "./tasksSlice";

const thunksStore = configureStore({
	reducer: {
		habits: habitsReducer,
		weeklyTasks: tasksReducer,
	},
});

export default thunksStore;

// Export RootState and AppDispatch types
//export type RootState = ReturnType<typeof thunksStore.getState>;
//export type AppDispatch = typeof thunksStore.dispatch;
