import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
	isLoading: boolean;
	status: "idle" | "success" | "error";
	message?: string;
}

const initialState: LoadingState = {
	isLoading: false,
	status: "idle",
	message: "",
};

const loadingSlice = createSlice({
	name: "loading",
	initialState,
	reducers: {
		setLoading: (state) => {
			state.isLoading = true;
			state.status = "idle";
		},
		setSuccess: (state) => {
			state.isLoading = false;
			state.status = "success";
		},
		setError: (state, action: PayloadAction<string | undefined>) => {
			state.isLoading = false;
			state.status = "error";
			state.message = action?.payload || "Error";
		},
		resetLoading: (state) => {
			state.isLoading = false;
			state.status = "idle";
			state.message = "";
		},
	},
});

export const { setLoading, setSuccess, setError, resetLoading } =
	loadingSlice.actions;
export default loadingSlice.reducer;
