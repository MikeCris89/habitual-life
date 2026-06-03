import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	isNoneTimer,
	isRoundTimer,
	isSingleTimer,
	Timer,
} from "../../utils/types";

type TimerState = {
	timer: Timer;
	isPlaying: boolean;
	duration: number;
	remainingTime: number;
	key: number;
	currRound: number;
	currSet: number;
	isComplete: boolean;
	isBreak: boolean;
	startTime?: number;
};

const initialState: TimerState = {
	timer: { type: "none" },
	isPlaying: false,
	duration: 0,
	remainingTime: 0,
	key: 0,
	currRound: 1,
	currSet: 1,
	isComplete: false,
	isBreak: false,
} as TimerState;

const timerSlice = createSlice({
	name: "timer",
	initialState,
	reducers: {
		setTimer: (_, action: PayloadAction<Timer>) =>
			!isNoneTimer(action.payload)
				? {
						...initialState,
						timer: {
							...action.payload,
						},
						duration: action.payload.duration / 1000,
				  }
				: { ...initialState },
		startTimer: (state) => {
			state.isPlaying = !state.isPlaying;
		},
		restartTimer: (state) => {
			state.isPlaying = false;
			state.key++;
		},
		onComplete: (state) => {
			const { timer } = state;

			if (isNoneTimer(timer)) return;

			if (isSingleTimer(timer)) {
				state.isComplete = true;
				return;
			}

			if (isRoundTimer(timer)) {
				const isLastRound = state.currRound === timer.rounds;
				const isLastSet = state.currSet === timer.sets;
				// Timer Fully Complete
				if (isLastRound && isLastSet) {
					state.isComplete = true;
					return;
				}
				// Break after rounds
				if (timer.breakDuration !== 0 && !state.isBreak) {
					state.duration = timer.breakDuration / 1000;
					state.isBreak = true;
				} else {
					// Set / Round transition
					if (isLastRound) state.currSet++;
					state.currRound = isLastRound ? 1 : state.currRound + 1;
					state.duration = timer.duration / 1000;
					state.isBreak = false;
				}
				state.key++;
			}
		},
	},
});

export default timerSlice.reducer;
export const { setTimer, startTimer, restartTimer, onComplete } =
	timerSlice.actions;
