import timerReducer, {
	onComplete,
	setTimer,
	startTimer,
	restartTimer,
} from "../features/timer/timerSlice";
import { mockRoundTimer, mockSingleTimer } from "./mocks/mockData";

describe("timerSlice", () => {
	it("should set isComplete to true when single timer completes", () => {
		const stateWithTimer = timerReducer(undefined, setTimer(mockSingleTimer));
		const newState = timerReducer(stateWithTimer, onComplete());

		expect(newState.isComplete).toBe(true);
	});

	it("should set isBreak to true after a round completes when breakDuration is set", () => {
		const stateWithTimer = timerReducer(undefined, setTimer(mockRoundTimer));
		const newState = timerReducer(stateWithTimer, onComplete());

		expect(newState.isBreak).toBe(true);
		expect(newState.isComplete).toBe(false);
	});

	it("should advance to next round after break completes", () => {
		const stateWithTimer = timerReducer(undefined, setTimer(mockRoundTimer));
		const afterRound = timerReducer(stateWithTimer, onComplete()); // goes to break
		const afterBreak = timerReducer(afterRound, onComplete()); // ends break

		expect(afterBreak.isBreak).toBe(false);
		expect(afterBreak.currRound).toBe(2);
	});

	it("should set isComplete when last round of last set completes", () => {
		let state = timerReducer(undefined, setTimer(mockRoundTimer));
		// cycle through all rounds and sets
		const totalTransitions = mockRoundTimer.rounds * 2 * mockRoundTimer.sets;
		for (let i = 0; i < totalTransitions; i++) {
			state = timerReducer(state, onComplete());
		}

		expect(state.isComplete).toBe(true);
	});

	it("should toggle isPlaying on startTimer", () => {
		const state = timerReducer(undefined, setTimer(mockSingleTimer));
		const playing = timerReducer(state, startTimer());
		expect(playing.isPlaying).toBe(true);

		const paused = timerReducer(playing, startTimer());
		expect(paused.isPlaying).toBe(false);
	});

	it("should reset playing and increment key on restartTimer", () => {
		const state = timerReducer(undefined, setTimer(mockSingleTimer));
		const playing = timerReducer(state, startTimer());
		const restarted = timerReducer(playing, restartTimer());

		expect(restarted.isPlaying).toBe(false);
		expect(restarted.key).toBe(1);
	});
});
