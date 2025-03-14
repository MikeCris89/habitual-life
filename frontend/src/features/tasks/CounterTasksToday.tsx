import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { isCounterTask, PresetId } from "../../utils/types";
import {
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
	useIncrementCounterMutation,
} from "./tasksApi";
import { LocalDining } from "@mui/icons-material";
import ProgressBar from "../../components/ProgressBar";
import { getCompletionRate } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const CounterTasksToday = () => {
	const navigate = useNavigate();
	const { data: tasks } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [] }) => ({ data: data.filter(isCounterTask) }),
	});

	const { dataByHabitId } = useGetTasksByRangeQuery()?.data ?? {};

	const [incrementTask] = useIncrementCounterMutation();

	console.log("CounterTaskToday render ", tasks);
	return (
		<Box sx={{ p: 2, width: "100%" }}>
			{tasks && tasks.length > 0 && (
				<Box className="flex-center gap4" sx={{ overflowY: "auto" }}>
					{tasks.map((task) => {
						// Calorie Counter
						if (task.habitId === PresetId.calorieCounter) {
							return (
								<Paper
									key={task.id}
									className="flex-center col gap1"
									sx={{ padding: "3px 6px" }}
									onClick={() => navigate(`/${PresetId.calorieCounter}/log`)}
								>
									<Typography variant="body2" sx={{ fontSize: "12px" }}>
										Calories
									</Typography>
									<Box className="flex-between gap2">
										<IconButton size="small">
											<LocalDining />
										</IconButton>
										<Box className="flex-center col">
											<Typography variant="body1">{task.count}</Typography>
											<Typography variant="body2" sx={{ fontSize: "12px" }}>
												/{task.total}
											</Typography>
										</Box>
									</Box>

									<ProgressBar
										completionRate={getCompletionRate(
											dataByHabitId?.[task.habitId] || [],
											task
										)}
									/>
								</Paper>
							);
						}
						return (
							<Box
								className="flex-center col"
								key={task.id}
								onClick={() => incrementTask({ task })}
								sx={{ minWidth: 0 }}
							>
								<Box>
									<Box className="flex-center">
										<Button
											variant="outlined"
											className="flex-center"
											sx={{
												borderRadius: "50%",
												minWidth: 30,
												minHeight: 30,
												margin: "auto",
											}}
										>
											{task.count}
										</Button>
									</Box>
									<Typography sx={{ fontSize: "12px", textAlign: "center" }}>
										{task.title}
									</Typography>
								</Box>
							</Box>
						);
					})}
				</Box>
			)}
		</Box>
	);
};

export default CounterTasksToday;
