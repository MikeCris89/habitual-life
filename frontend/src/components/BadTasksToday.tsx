import { Box, Button, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectBadTasksToday } from "../utils/selectors";
import { Task } from "../utils/types";
import { Check } from "@mui/icons-material";
import { checkOff } from "../features/tasks/tasksSlice";

type TaskProps = {
	task: Task;
};

const TasksToday: React.FC<TaskProps> = ({ task }) => {
	const dispatch = useDispatch();
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
						dispatch(checkOff(task));
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

const BadTasksToday: React.FC = () => {
	const tasksToday = useSelector(selectBadTasksToday);

	return (
		<div>
			{tasksToday && tasksToday.length > 0 ? (
				<Box className="flex-center col gap2">
					{tasksToday.map((task, i) => (
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
