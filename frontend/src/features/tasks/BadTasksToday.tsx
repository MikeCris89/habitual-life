import { Box, Typography } from "@mui/material";
import { isBadTask } from "../../utils/types";
import { useGetDailyTasksQuery, useGetTasksByRangeQuery } from "./tasksApi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { selectCurrentGoal } from "../stats/statsSelectors";
import TaskCard from "../../components/TaskCard";

// type TaskProps = {
// 	task: Task;
// 	goal: number;
// 	pastTasks: Task[];
// };

// const TasksToday = ({ task, goal, pastTasks }: TaskProps) => {
// 	const [checkOffTask, { isLoading: loadingCheck, error: errorCheck }] =
// 		useCheckOffTaskMutation();
// 	const completionRate =
// 		pastTasks.length > 0
// 			? Math.round(
// 					(pastTasks.filter((t) => t.complete).length / pastTasks.length) * 100
// 			  )
// 			: 0;
// 	return (
// 		<>
// 			<Paper className="flex-center col gap2" sx={{ p: 1 }}>
// 				<Box className="flex-between gap2" sx={{ width: "100%" }}>
// 					<Box
// 						sx={{
// 							flex: "1 1 auto",
// 							flexWrap: "wrap",
// 							height: "100%",
// 							overflowWrap: "break-word",
// 							overflow: "hidden",
// 						}}
// 					>
// 						<Typography variant="body1">{task.title}</Typography>
// 					</Box>
// 					<Button
// 						size="small"
// 						variant={task.complete ? "contained" : "outlined"}
// 						onClick={() => {
// 							checkOffTask(task);
// 						}}
// 						sx={{
// 							borderRadius: "50%",
// 							padding: 0,
// 							minHeight: 40,
// 							minWidth: 40,
// 						}}
// 					>
// 						<Check />
// 					</Button>
// 				</Box>
// 				<Box sx={{ width: "100%", mr: 1 }}>
// 					<LinearProgress
// 						variant="determinate"
// 						value={completionRate}
// 						sx={{
// 							borderRadius: 5,
// 							backgroundColor: "#ddd",
// 							"& .MuiLinearProgress-bar": {
// 								backgroundColor:
// 									completionRate >= goal - 5
// 										? "green"
// 										: completionRate >= goal - 15
// 										? "orange"
// 										: "red",
// 							},
// 						}}
// 					/>
// 				</Box>
// 			</Paper>
// 		</>
// 	);
// };

const BadTasksToday = () => {
	const { data: tasks } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [] }) => ({ data: data.filter(isBadTask) }),
	});
	const { data: { dataByHabitId: pastTasks = {} } = {} } =
		useGetTasksByRangeQuery();
	const goal = useSelector((state: RootState) => selectCurrentGoal(state));
	console.log("BadTasksToday Rendering: ", tasks);

	return (
		<Box className="flex-center col" sx={{ p: 1, gap: "10px" }}>
			{tasks && tasks.length > 0 ? (
				<>
					{tasks.map((task, i) => (
						<Box key={`${task.id}-${i}`} sx={{ width: "100%" }}>
							<TaskCard
								task={task}
								goal={goal}
								pastTasks={pastTasks[task.habitId] ?? []}
								circleIcon={true}
							/>
						</Box>
					))}
				</>
			) : (
				<Typography variant="h6">No Tasks for today.</Typography>
			)}
		</Box>
	);
};

export default BadTasksToday;
