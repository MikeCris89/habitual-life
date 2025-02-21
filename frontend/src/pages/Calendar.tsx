import { Box, Typography } from "@mui/material";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import { useDispatch, useSelector } from "react-redux";
import { selectMissingWeeklyTasks } from "../features/calendar/calendarSelectors";
import { RootState } from "../app/store";
import { useEffect, useMemo, useState } from "react";
import { GoodTask, HabitTypes, isGoodTask, Task } from "../utils/types";
import { useGetWeeklyTasksQuery } from "../features/tasks/tasksApi";
import { setSelectedWeek } from "../features/calendar/calendarSlice";
import {
	endOfWeek,
	nextDay,
	startOfDay,
	startOfWeek,
} from "../utils/timeUtils";
import GoodCalendar from "../features/calendar/GoodCalendar";

const Calendar = () => {
	const dispatch = useDispatch();
	const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);

	const { data: habitList } = useGetHabitsQuery();

	const selectedWeek = useSelector(
		(state: RootState) => state.calendar.selectedWeek
	);

	const { data: existingTasks } = useGetWeeklyTasksQuery(selectedWeek);

	const habits = useMemo(() => habitList ?? [], [habitList]);

	const { weekStart, weekEnd, isCurrentWeek } = useMemo(() => {
		const weekDate = new Date(selectedWeek);
		const today = startOfDay();
		const weekStart = startOfWeek(weekDate);
		const weekEnd = endOfWeek(weekDate);
		return {
			weekStart,
			weekEnd,
			isCurrentWeek: today >= weekStart && today < weekEnd,
		};
	}, [selectedWeek]);

	const missingTasks = useSelector((state: RootState) =>
		selectMissingWeeklyTasks(state, habits, weekStart)
	);

	// SAVE FOR FUTURE - for history / existing tasks
	// useEffect(() => {
	// 	console.log(
	// 		"calendar useEffect render",
	// 		missingTasks,
	// 		existingTasks,
	// 		isCurrentWeek
	// 	);
	// 	setWeeklyTasks(
	// 		isCurrentWeek
	// 			? [...missingTasks, ...(existingTasks ?? [])]
	// 			: [...(existingTasks ?? [])]
	// 	);

	// }, [missingTasks, existingTasks, isCurrentWeek]);

	// READ ONLY - for viewing weekly set up
	useEffect(() => {
		console.log("calendar useEffect render", missingTasks);
		setWeeklyTasks([...missingTasks]);
	}, [missingTasks]);

	console.log("calendar render");
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
