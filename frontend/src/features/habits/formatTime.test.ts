import { formatTime } from "../../utils/timeUtils";

describe("formatTime() functions properly and returns right datetimes.", () => {
	it("should set todays date with the provided UTC time.", () => {
		const today = new Date("2025-01-14T00:00:00Z");
		const result = formatTime("2025-01-11T01:00:00Z", today);
		const expected = "2025-01-14T01:00:00.000Z";
		expect(result).toBe(expected);
	});
	it("should handle edge case for midnight (00:00)", () => {
		const today = new Date("2025-01-14T00:00:00Z");
		const result = formatTime("2025-01-11T00:00:00Z", today);
		const expected = "2025-01-14T00:00:00.000Z";
		expect(result).toBe(expected);
	});
	// Test for a UTC time close to midnight transitioning to the next day in local time
	it("should handle a time close to midnight transitioning to the next local day", () => {
		const today = new Date("2025-01-14T00:00:00Z");
		const result = formatTime("2025-01-11T23:59:00Z", today);
		const expected = "2025-01-13T23:59:00.000Z";
		expect(result).toBe(expected);
	});
	it("should return an empty string for invalid input", () => {
		const result = formatTime("");
		expect(result).toBe("");
	});
});
