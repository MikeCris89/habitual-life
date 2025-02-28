import { Box, Button, LinearProgress, Paper, Typography } from "@mui/material";
import { GoodTask, Task } from "../../utils/types";
import { CheckCircleTwoTone } from "@mui/icons-material";
import { useCheckOffTaskMutation, useGetTasksByRangeQuery } from "./tasksApi";
import dayjs from "dayjs";
import { selectCurrentGoal } from "../stats/statsSelectors";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface TaskProps {
	task: Task;
	sameTime: boolean;
	pastTasks: Task[];
	goal: number;
}

const TasksToday = ({ task, sameTime, pastTasks, goal }: TaskProps) => {
	const [checkOffTask, { isLoading, error }] = useCheckOffTaskMutation();

	const totalTasks = pastTasks?.length + 1;
	const completeTasks = pastTasks?.filter((task) => task.complete).length ?? 0;

	const completionRate =
		totalTasks > 0
			? Math.round(
					((completeTasks + (task.complete ? 1 : 0)) / totalTasks) * 100
			  )
			: 0;

	return (
		<Box
			sx={{
				width: "100%",
				flex: 1,
				paddingLeft: sameTime ? "15px" : "0",
				paddingTop: sameTime ? "0px" : "5px",
			}}
		>
			<Paper className="flex-center col gap2" sx={{ p: 1 }}>
				<Box className="flex-between" sx={{ width: "100%" }}>
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
						variant={task.complete ? "contained" : "outlined"}
						onClick={() => {
							checkOffTask(task);
						}}
					>
						<CheckCircleTwoTone />
					</Button>
				</Box>
				<Box sx={{ width: "100%", mr: 1 }}>
					<LinearProgress
						variant="determinate"
						value={completionRate}
						sx={{
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
			</Paper>
		</Box>
	);
};

interface GoodProps {
	tasks: GoodTask[];
}

const GoodTasksToday = ({ tasks }: GoodProps) => {
	const { tasksAllDay, tasksByTime } = tasks.reduce<{
		tasksAllDay: Task[];
		tasksByTime: Task[];
	}>(
		(acc, task) => {
			if (task.allDay) acc.tasksAllDay.push(task);
			else acc.tasksByTime.push(task);
			return acc;
		},
		{ tasksAllDay: [], tasksByTime: [] }
	);

	const { data: pastTasks } = useGetTasksByRangeQuery();
	const goal = useSelector((state: RootState) => selectCurrentGoal(state));

	const sortedTasksByTime = [...tasksByTime].sort(
		(a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
	);
	const sortedTasksAllDay = [...tasksAllDay].sort(
		(a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
	);

	console.log("GoodTasksToday Render ");

	return (
		<Box
			className="flex-center col"
			sx={{ position: "relative", p: 1, gap: "10px" }}
		>
			{tasks && tasks.length > 0 ? (
				<>
					{sortedTasksAllDay && (
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "1fr 3fr",
								width: "100%",
								alignItems: "start",
								borderRadius: "8px",
								p: 1,
								borderBottom: "1px solid grey",
								paddingBottom: "15px",
								marginBottom: "5px",
								bgcolor: "primary.light",
							}}
						>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: "bold" }}>
									All Day
								</Typography>
							</Box>
							<Box
								className="flex-center col gap2"
								sx={{
									flex: 1,
								}}
							>
								{sortedTasksAllDay.map((task) => (
									<Box key={`${task.id}`} sx={{ width: "100%" }}>
										<TasksToday
											task={task}
											sameTime={false}
											pastTasks={
												pastTasks?.filter(
													(thisTask) => thisTask.habitId === task.habitId
												) ?? []
											}
											goal={goal}
										/>
									</Box>
								))}
							</Box>
						</Box>
					)}

					{sortedTasksByTime.map((task, i) => {
						const sameTime =
							i > 0 && sortedTasksByTime[i - 1].dateTime === task.dateTime;
						return (
							<Box
								key={`${task.id}-${i}`}
								sx={{
									display: "grid",
									gridTemplateColumns: "1fr 3fr",
									width: "100%",
								}}
							>
								<Box>
									{(i === 0 || !sameTime) && (
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: "6px",
											}}
										>
											<Box
												sx={{
													width: "6px",
													height: "6px",
													borderRadius: "50%",
													bgcolor: "text.secondary",
												}}
											/>
											<Typography
												variant="body2"
												sx={{
													fontWeight: "bold",
													color: "text.secondary",
												}}
											>
												{dayjs(task.dateTime).format("h:mm A")}
											</Typography>
										</Box>
									)}
								</Box>
								<TasksToday
									task={task}
									sameTime={sameTime}
									pastTasks={
										pastTasks?.filter(
											(thisTask) => thisTask.habitId === task.habitId
										) ?? []
									}
									goal={goal}
								/>
							</Box>
						);
					})}
				</>
			) : (
				<Typography variant="h6">No Tasks for today.</Typography>
			)}
		</Box>
	);
};

export default GoodTasksToday;
