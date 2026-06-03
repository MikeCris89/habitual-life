import { Box, Typography } from "@mui/material";
import { isBadTask, Task } from "../../utils/types";
import { useGetDailyTasksQuery, useGetTasksByRangeQuery } from "./tasksApi";
import TaskCard from "./TaskCard";
import { nextDay, startOfDay } from "../../utils/timeUtils";

interface BadTasksTodayProps {
	selectedDate: string;
}

const BadTasksToday = ({ selectedDate }: BadTasksTodayProps) => {
	const todayStart = startOfDay();
	const selectedStart = startOfDay(selectedDate);
	const isToday = todayStart === selectedStart;
	const selectedEnd = nextDay(selectedStart);

	const { data: todayTasks = [] } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [] }) => ({ data: data.filter(isBadTask) }),
	});

	const { dataArray = [], dataByHabitId: pastTasks = {} } =
		useGetTasksByRangeQuery()?.data ?? {};

	const startMs = new Date(selectedStart).getTime();
	const endMs = new Date(selectedEnd).getTime();

	const tasks: Task[] = isToday
		? todayTasks
		: dataArray.filter((task) => {
				if (!isBadTask(task)) return false;
				const time = new Date(task.dateTime).getTime();
				return time >= startMs && time < endMs;
		  });

	return (
		<Box
			className="flex-center col full-h"
			sx={{ p: 1, gap: "10px", justifyContent: "flex-start" }}
		>
			{tasks && tasks.length > 0 ? (
				<>
					{tasks.map((task, i) => (
						<Box key={`${task.id}-${i}`} sx={{ width: "100%" }}>
							<TaskCard
								task={task}
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
