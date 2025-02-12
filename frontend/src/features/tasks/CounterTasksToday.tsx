import { Box, Button, Typography } from "@mui/material";
import { CounterTask } from "../../utils/types";
import { useIncrementCounterMutation } from "./tasksApi";
type Props = {
	tasks: CounterTask[];
};
const CounterTasksToday: React.FC<Props> = ({ tasks }) => {
	const [incrementTask, { isLoading, error }] = useIncrementCounterMutation();
	return (
		<Box sx={{ p: 2, width: "100%" }}>
			{tasks && (
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
