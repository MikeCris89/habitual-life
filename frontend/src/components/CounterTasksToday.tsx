import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectCounterTasksToday } from "../utils/selectors";
import { checkOff } from "../features/tasks/tasksSlice";

const CounterTasksToday = () => {
	const tasksToday = useSelector(selectCounterTasksToday);
	const dispatch = useDispatch();
	return (
		<Box sx={{ p: 2, width: "100%" }}>
			{tasksToday && (
				<Box className="flex-center gap4" sx={{ overflow: "auto" }}>
					{tasksToday.map((task) => (
						<Box
							className="flex-center col"
							key={task.id}
							onClick={() => dispatch(checkOff({ id: task.id, value: 1 }))}
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
