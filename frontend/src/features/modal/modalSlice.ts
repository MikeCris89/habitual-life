import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitType {
	isOpen: boolean;
	component: string | null;
	props?: Record<string, any>;
	title?: string;
}

const initialState: InitType = {
	isOpen: false,
	component: null,
};

const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		openModal: (
			state,
			action: PayloadAction<{
				component: string;
				props?: Record<string, any>;
				title?: string;
			}>
		) => {
			state.isOpen = true;
			state.component = action.payload.component;
			state.props = action.payload.props || {};
			state.title = action.payload.title || "";
		},
		closeModal: (state) => {
			state.isOpen = false;
			state.component = null;
			state.props = {};
			state.title = "";
		},
	},
});

export default modalSlice.reducer;
export const { openModal, closeModal } = modalSlice.actions;
