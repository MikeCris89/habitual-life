import { Box } from "@mui/material";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import { useDispatch, useSelector } from "react-redux";
import { selectRemainingWeeklyTasks } from "../features/calendar/calendarSelectors";
import { RootState } from "../app/store";
import { useEffect, useMemo, useState } from "react";
import { GoodTask, isGoodTask, Task } from "../utils/types";
import { endOfWeek, startOfDay, startOfWeek } from "../utils/timeUtils";
import GoodCalendar from "../features/calendar/GoodCalendar";
import { useGetTasksByRangeQuery } from "../features/tasks/tasksApi";

const Calendar = () => {
	//const dispatch = useDispatch();
	const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);

	//const { data: habitList } = useGetHabitsQuery();

	// const selectedWeek = useSelector(
	// 	(state: RootState) => state.calendar.selectedWeek
	// );

	const { data: existingTasks } = useGetTasksByRangeQuery();

	// const habits = useMemo(() => habitList ?? [], [habitList]);

	// const { weekStart, weekEnd, isCurrentWeek } = useMemo(() => {
	// 	const today = startOfDay();
	// 	const weekStart = startOfWeek(selectedWeek);
	// 	const weekEnd = endOfWeek(selectedWeek);
	// 	return {
	// 		weekStart,
	// 		weekEnd,
	// 		isCurrentWeek: today >= weekStart && today < weekEnd,
	// 	};
	// }, [selectedWeek]);

	// const missingTasks = useSelector((state: RootState) =>
	// 	selectMissingWeeklyTasks(state, habits, weekStart)
	// );

	const missingTasks = useSelector((state: RootState) =>
		selectRemainingWeeklyTasks(state)
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
