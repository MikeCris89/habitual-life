import { Box, Button, Paper, Typography } from "@mui/material";
import { BadTask, Task } from "../../utils/types";
import { Check } from "@mui/icons-material";
import { useCheckOffTaskMutation } from "./tasksApi";

type TaskProps = {
	task: Task;
};

const TasksToday: React.FC<TaskProps> = ({ task }) => {
	const [checkOffTask, { isLoading: loadingCheck, error: errorCheck }] =
		useCheckOffTaskMutation();
	return (
		<Box>
			<Paper className="flex-between" sx={{ p: 1 }}>
				<Box
					sx={{
						flex: "1 1 auto",
						flexWrap: "wrap",
						height: "100%",
						overflowWrap: "break-word",
						overflow: "hidden",
					}}
				>
					<Typography variant="body1">{task.title}</Typography>
				</Box>
				<Button
					size="small"
					variant={task.complete ? "contained" : "outlined"}
					onClick={() => {
						console.log("onClick Task: ", task);
						checkOffTask(task);
					}}
					sx={{
						borderRadius: "50%",
						padding: 0,
						minHeight: 40,
						minWidth: 40,
					}}
				>
					<Check />
				</Button>
			</Paper>
		</Box>
	);
};
type Props = {
	tasks: BadTask[];
};
const BadTasksToday: React.FC<Props> = ({ tasks }) => {
	return (
		<div>
			{tasks && tasks.length > 0 ? (
				<Box className="flex-center col gap2">
					{tasks.map((task, i) => (
						<Box key={`${task.id}-${i}`} sx={{ width: "100%" }}>
							<TasksToday task={task} />
						</Box>
					))}
				</Box>
			) : (
				<Typography variant="h4">No Tasks for today.</Typography>
			)}
		</div>
	);
};

export default BadTasksToday;
