import { Box, Button } from "@mui/material";
import { useCreateTestTaskDataMutation } from "../tasks/tasksApi";
import { useGetHabitsQuery } from "../habits/habitsApi";
import { startOfDay, statsStartDate } from "../../utils/timeUtils";
import { useSelector } from "react-redux";
import { selectDailyStats, selectMonthlyStats } from "./statsSelectors";
import { RootState } from "../../app/store";

const StatsSummary = () => {
	const [createTestData, { isLoading }] = useCreateTestTaskDataMutation();
	const { data: habits } = useGetHabitsQuery();
	const today = startOfDay();

	const pastStats = useSelector((state: RootState) => state.stats);
	const monthlyStats = useSelector((state: RootState) =>
		selectMonthlyStats(state)
	);
	// const weeklyStats = useSelector((state: RootState) =>
	// 	selectWeeklyStats(state, weeklyProps)
	// );
	const dailyStats = useSelector((state: RootState) => selectDailyStats(state));

	const handleTestData = async () => {
		if (habits) {
			await createTestData({
				habits,
				completionRate: 70,
				startDate: statsStartDate(),
				endDate: today,
			});
		}
	};

	//console.log("pastStats", pastStats);
	// console.log("weeklyStats ", weeklyStats);
	// console.log("monthlyStats ", monthlyStats);

	return (
		<Box>
			<Button onClick={handleTestData} loading={isLoading}>
				Add Tasks
			</Button>
			{pastStats && (
				<Box>
					<Box>
						Monthly Stats: {monthlyStats.completionRate}%
						{monthlyStats.forecastStatus}
					</Box>
					{/* <Box>Weekly Stats: {weeklyStats.completionRate}% </Box> */}
					<Box>Daily Stats: {dailyStats.completionRate}% </Box>
				</Box>
			)}
		</Box>
	);
};

export default StatsSummary;
