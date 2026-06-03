// Pure Function Test
import { generateTasks } from "../features/tasks/tasksApi";
import {
	endOfWeek,
	nextDay,
	startOfDay,
	startOfWeek,
} from "../utils/timeUtils";
import { mockGoodHabitAllDay, mockGoodHabitWithTimes } from "../mocks/mockData";

jest.mock("../utils/indexedDb", () => ({
	dbActions: {},
	dbPromise: Promise.resolve(),
}));

describe("generateTasks", () => {
	it("should generate one task for an all-day habit on a matching day", () => {
		// Arrange — Monday Jan 6 2025
		const monday = startOfDay("2025-01-06T12:00:00.000Z");
		const tuesday = nextDay(monday);

		// Act
		const result = generateTasks([mockGoodHabitAllDay], monday, tuesday);

		// Assert
		expect(result).toHaveLength(1);
		expect(result[0].habitId).toBe(mockGoodHabitAllDay.id);
		expect(result[0].title).toBe(mockGoodHabitAllDay.title);
		expect(result[0].complete).toBe(false);
		expect(result[0].type).toBe(mockGoodHabitAllDay.type);
	});
	it("should generate a task for each time of day on a weekday", () => {
		// Arrange — Monday Jan 6 2025
		const monday = startOfDay("2025-01-06T12:00:00.000Z");
		const tuesday = nextDay(monday);

		// ACT
		const result = generateTasks([mockGoodHabitWithTimes], monday, tuesday);

		// Assert
		expect(result).toHaveLength(mockGoodHabitWithTimes.timeOfDay.length);
		result.forEach((task) => {
			expect(task.habitId).toBe(mockGoodHabitWithTimes.id);
			expect(task.title).toBe(mockGoodHabitWithTimes.title);
			expect(task.complete).toBe(false);
			expect(task.type).toBe(mockGoodHabitWithTimes.type);
		});
	});
	it("should not generate tasks on weekend days", () => {
		const sunday = startOfDay("2025-01-05T12:00:00.000Z");
		const next = nextDay(sunday);

		const result = generateTasks([mockGoodHabitWithTimes], sunday, next);

		expect(result).toHaveLength(0);
	});
	it("should only generate tasks on weekdays over a full week", () => {
		const start = startOfWeek();
		const end = endOfWeek();

		const result = generateTasks([mockGoodHabitWithTimes], start, end);

		expect(result).toHaveLength(mockGoodHabitWithTimes.timeOfDay.length * 5);
	});
});
