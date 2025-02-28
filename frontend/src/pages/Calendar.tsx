import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectRemainingWeeklyTasks } from "../features/calendar/calendarSelectors";
import { RootState } from "../app/store";
import { useEffect, useState } from "react";
import { GoodTask, isGoodTask, Task } from "../utils/types";
import { startOfWeek } from "../utils/timeUtils";
import GoodCalendar from "../features/calendar/GoodCalendar";
import {
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
} from "../features/tasks/tasksApi";

const Calendar = () => {
	const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);
	const EMPTY_ARR: Task[] = [];

	const missingTasks = useSelector(
		(state: RootState) => selectRemainingWeeklyTasks(state) ?? EMPTY_ARR
	);

	// DO NOT DELETE - for future set up
	// const { data: existingTasks = EMPTY_ARR } = useGetTasksByRangeQuery();
	// const { data: tasksToday = EMPTY_ARR } = useGetDailyTasksQuery();

	// useEffect(() => {
	// 	setWeeklyTasks([
	// 		...existingTasks.filter(
	// 			(task) => new Date(task.dateTime) >= new Date(startOfWeek())
	// 		),
	// 		...missingTasks,
	// 		...tasksToday,
	// 	]);
	// }, [missingTasks, existingTasks, tasksToday]);

	// READ ONLY - for viewing weekly set up
	useEffect(() => {
		setWeeklyTasks([...missingTasks]);
	}, [missingTasks]);

	return (
		<Box sx={{ height: "100%", width: "100vw" }}>
			{
				<GoodCalendar
					tasks={weeklyTasks.filter((task): task is GoodTask =>
						isGoodTask(task)
					)}
				/>
			}
		</Box>
	);
};

export default Calendar;
