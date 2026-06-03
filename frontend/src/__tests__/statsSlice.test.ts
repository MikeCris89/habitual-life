import statsReducer, { setPastStats } from "../features/stats/statsSlice";
import { startOfDay } from "../utils/timeUtils";
import { mockTasks } from "../mocks/mockData";

const today = startOfDay();

describe("statsSlice - setPastStats", () => {
	it("should correctly count total and completed tasks", () => {
		const newState = statsReducer(undefined, setPastStats(mockTasks));

		expect(newState.totalTasks).toBe(3);
		expect(newState.completedTasks).toBe(2);
	});

	it("should correctly calculate completion rate per day", () => {
		const newState = statsReducer(undefined, setPastStats(mockTasks));

		const dayStats = newState.pastStats[today];
		expect(dayStats.totalTasks).toBe(3);
		expect(dayStats.completedTasks).toBe(2);
		expect(dayStats.completionRate).toBe(67); // Math.round(2/3 * 100)
	});

	it("should initialize day stats if they don't exist yet", () => {
		const newState = statsReducer(undefined, setPastStats(mockTasks));

		expect(newState.pastStats[today]).toBeDefined();
	});
});
