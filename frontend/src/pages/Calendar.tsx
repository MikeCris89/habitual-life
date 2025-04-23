import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectWeeklyTasks } from "../features/calendar/calendarSelectors";
import { RootState } from "../app/store";
import { useEffect, useState } from "react";
import { GoodTask, isGoodTask, Task } from "../utils/types";
import GoodCalendar from "../features/calendar/GoodCalendar";

import { useGetHabitsQuery } from "../features/habits/habitsApi";
import Loading from "../components/Loading";
import PageWrapper from "../components/PageWrapper";

const Calendar = () => {
	const [calendarTasks, setCalendarTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { isLoading: loadingHabits } = useGetHabitsQuery();

	const allWeeklyTasks = useSelector((state: RootState) =>
		selectWeeklyTasks(state)
	);

	// const {
	// 	data: habits = EMPTY_HABIT_ARR,
	// 	isLoading: loadingHabits,
	// 	error: errorHabits,
	// } = useGetHabitsQuery();

	// DO NOT DELETE - for future set up
	// const missingTasks = useSelector(
	// 	(state: RootState) => selectRemainingWeeklyTasks(state) ?? EMPTY_TASK_ARR
	// );
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
		setCalendarTasks([...allWeeklyTasks]);
	}, [allWeeklyTasks]);

	console.log("calendar weekly tasks", allWeeklyTasks);

	if (isLoading || loadingHabits) return <Loading />;

	return (
		<PageWrapper>
			{
				<GoodCalendar
					tasks={calendarTasks.filter((task): task is GoodTask =>
						isGoodTask(task)
					)}
				/>
			}
		</PageWrapper>
	);
};

export default Calendar;
