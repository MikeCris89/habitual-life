import { startOfWeek } from "../../utils/timeUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CalendarState {
	selectedWeek: string;
}

const initialState: CalendarState = {
	selectedWeek: startOfWeek(),
};

const calendarSlice = createSlice({
	name: "calendar",
	initialState,
	reducers: {
		setSelectedWeek: (state, action: PayloadAction<string>) => {
			state.selectedWeek = action.payload;
		},
	},
});

export const { setSelectedWeek } = calendarSlice.actions;
export default calendarSlice.reducer;
