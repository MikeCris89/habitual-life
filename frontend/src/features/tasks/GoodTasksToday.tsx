import { Box, Typography } from "@mui/material";
import { isGoodTask, Task } from "../../utils/types";
import { useGetDailyTasksQuery, useGetTasksByRangeQuery } from "./tasksApi";
import dayjs from "dayjs";
import TaskCard from "../../components/TaskCard";

const GoodTasksToday = () => {
	const { tasksAllDay, tasksByTime, allTasks } = useGetDailyTasksQuery(
		undefined,
		{
			selectFromResult: ({ data = [] }) => {
				return data.filter(isGoodTask).reduce<Record<string, Task[]>>(
					(acc, task) => {
						acc.allTasks.push(task);
						task.allDay
							? acc.tasksAllDay.push(task)
							: acc.tasksByTime.push(task);
						return acc;
					},
					{ allTasks: [], tasksAllDay: [], tasksByTime: [] }
				);
			},
		}
	);

	const { dataByHabitId: pastTasks = {} } =
		useGetTasksByRangeQuery()?.data ?? {};

	const sortedTasksByTime = [...tasksByTime].sort(
		(a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
	);
	const sortedTasksAllDay = [...tasksAllDay].sort(
		(a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
	);

	console.log("GoodTasksToday Rendering", allTasks);

	return (
		<Box className="flex-center col" sx={{ p: 1, gap: "10px" }}>
			{!sortedTasksAllDay.length && !sortedTasksByTime.length && (
				<Typography variant="h6">No Tasks for today.</Typography>
			)}
			{sortedTasksAllDay.length > 0 && (
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
								<TaskCard
									task={task}
									pastTasks={pastTasks[task.habitId] ?? []}
								/>
							</Box>
						))}
					</Box>
				</Box>
			)}

			{sortedTasksByTime.length > 0 &&
				sortedTasksByTime.map((task, i) => {
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
							<TaskCard task={task} pastTasks={pastTasks[task.habitId] ?? []} />
						</Box>
					);
				})}
		</Box>
	);
};

export default GoodTasksToday;
