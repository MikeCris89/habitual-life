import { Box, Button, Typography } from "@mui/material";
import { isCounterTask } from "../../utils/types";
import { useGetDailyTasksQuery, useIncrementCounterMutation } from "./tasksApi";

const CounterTasksToday = () => {
	const tasks = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [] }) => data.filter(isCounterTask),
	});

	const [incrementTask, { isLoading, error }] = useIncrementCounterMutation();

	console.log("CounterTaskToday render ");
	return (
		<Box sx={{ p: 2, width: "100%" }}>
			{tasks && tasks.length > 0 && (
				<Box className="flex-center gap4" sx={{ overflow: "auto" }}>
					{tasks.map((task) => (
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
					))}
				</Box>
			)}
		</Box>
	);
};

export default CounterTasksToday;
