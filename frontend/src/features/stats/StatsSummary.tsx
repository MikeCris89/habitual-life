import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useCreateTestTaskDataMutation } from "../tasks/tasksApi";
import { useGetHabitsQuery } from "../habits/habitsApi";
import { startOfDay, statsStartDate } from "../../utils/timeUtils";
import { useSelector } from "react-redux";
import { selectCurrentGoal, selectCurrentStats } from "./statsSelectors";
import { RootState } from "../../app/store";

const StatsSummary = () => {
	const [createTestData, { isLoading }] = useCreateTestTaskDataMutation();
	const { data: habits } = useGetHabitsQuery();
	const today = startOfDay();
	const goal = useSelector((state: RootState) => selectCurrentGoal(state));

	const pastStats = useSelector((state: RootState) => state.stats);

	const { completionRate } = useSelector((state: RootState) =>
		selectCurrentStats(state)
	);

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

	return (
		<Box className="flex-center col" sx={{ width: "90%" }}>
			<Button onClick={handleTestData} loading={isLoading}>
				Add Tasks
			</Button>
			{pastStats && (
				<Box sx={{ width: "100%" }}>
					<Box className="flex-between gap2" sx={{ width: "100%" }}>
						<Typography variant="body1" sx={{ fontWeight: "bold" }}>
							Progress:
						</Typography>
						<Box sx={{ width: "100%", mr: 1 }}>
							<LinearProgress
								variant="determinate"
								value={completionRate}
								sx={{
									height: 8,
									borderRadius: 5,
									backgroundColor: "#ddd",
									"& .MuiLinearProgress-bar": {
										backgroundColor:
											completionRate >= goal
												? "green"
												: completionRate >= goal - 10
												? "orange"
												: "red",
									},
								}}
							/>
						</Box>
						<Typography variant="body1" sx={{ fontWeight: "bold" }}>
							{completionRate}%
						</Typography>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default StatsSummary;
