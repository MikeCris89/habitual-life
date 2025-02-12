import { Box, Button, Paper, Typography } from "@mui/material";
import { GoodTask, Task } from "../../utils/types";
import { CheckCircleTwoTone } from "@mui/icons-material";
import { useCheckOffTaskMutation } from "./tasksApi";

type TaskProps = {
	task: Task;
};

const TasksToday: React.FC<TaskProps> = ({ task }) => {
	const [checkOffTask, { isLoading, error }] = useCheckOffTaskMutation();
	return (
		<Box sx={{ width: "100%" }}>
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
					<Typography variant="body2">
						{new Date(task.dateTime).toLocaleTimeString()}
					</Typography>
				</Box>
				<Button
					variant={task.complete ? "contained" : "outlined"}
					onClick={() => {
						console.log("onClick Task: ", task);
						checkOffTask(task);
					}}
				>
					<CheckCircleTwoTone />
				</Button>
			</Paper>
		</Box>
	);
};

type GoodProps = {
	tasks: GoodTask[];
};

const GoodTasksToday: React.FC<GoodProps> = ({ tasks }) => {
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

export default GoodTasksToday;
