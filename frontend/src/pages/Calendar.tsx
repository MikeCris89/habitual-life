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
	const { isLoading: loadingHabits } = useGetHabitsQuery();

	const allWeeklyTasks = useSelector((state: RootState) =>
		selectWeeklyTasks(state),
	);

	// READ ONLY - for viewing weekly set up
	useEffect(() => {
		setCalendarTasks([...allWeeklyTasks]);
	}, [allWeeklyTasks]);

	if (loadingHabits) return <Loading />;

	return (
		<PageWrapper>
			<GoodCalendar
				tasks={calendarTasks.filter((task): task is GoodTask =>
					isGoodTask(task),
				)}
			/>
		</PageWrapper>
	);
};

export default Calendar;
