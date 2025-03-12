import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useCreateTestTaskDataMutation } from "../tasks/tasksApi";
import { useGetHabitsQuery } from "../habits/habitsApi";
import { startOfDay, statsStartDate } from "../../utils/timeUtils";
import { useSelector } from "react-redux";
import { selectCurrentGoal, selectCurrentStats } from "./statsSelectors";
import { RootState } from "../../app/store";

const StatsSummary = () => {
	const goal = useSelector(selectCurrentGoal);

	const pastStats = useSelector((state: RootState) => state.stats);

	const { completionRate } = useSelector(selectCurrentStats);

	console.log("StatsSummary Rendering ", pastStats);

	return (
		<Box className="flex-center col" sx={{ width: "90%" }}>
			{pastStats && (
				<Box className="flex-center col" sx={{ width: "100%" }}>
					<Typography variant="body2">Avg Completion Rate</Typography>
					<Box className="flex-between gap2" sx={{ width: "80%" }}>
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
											completionRate >= goal - 5
												? "green"
												: completionRate >= goal - 15
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
