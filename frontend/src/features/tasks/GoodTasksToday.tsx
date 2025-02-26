import { Box, Button, Paper, Typography } from "@mui/material";
import { GoodTask, Task } from "../../utils/types";
import { CheckCircleTwoTone } from "@mui/icons-material";
import { useCheckOffTaskMutation } from "./tasksApi";
import dayjs from "dayjs";

interface TaskProps {
	task: Task;
	sameTime: boolean;
}

const TasksToday = ({ task, sameTime }: TaskProps) => {
	const [checkOffTask, { isLoading, error }] = useCheckOffTaskMutation();
	return (
		<Box
			sx={{
				width: "100%",
				flex: 1,
				paddingLeft: sameTime ? "15px" : "0",
				paddingTop: sameTime ? "0px" : "5px",
			}}
		>
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

	return (
		<Box
			className="flex-center col"
			sx={{ position: "relative", p: 1, gap: "10px" }}
		>
			{tasks && tasks.length > 0 ? (
				<>
					{tasksAllDay && (
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
								{tasksAllDay.map((task) => (
									<Box key={`${task.id}`} sx={{ width: "100%" }}>
										<TasksToday task={task} sameTime={false} />
									</Box>
								))}
							</Box>
						</Box>
					)}

					{tasksByTime
						.sort(
							(a, b) =>
								new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
						)
						.map((task, i) => {
							const sameTime =
								tasksByTime[Math.max(i - 1, 0)].dateTime === task.dateTime &&
								i !== 0;

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
									<TasksToday task={task} sameTime={sameTime} />
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
