import { ReactNode } from "react";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import {
	useCreateDailyTasksMutation,
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
} from "../features/tasks/tasksApi";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { handleError } from "../utils/errors";
import {
	useGetMetaQuery,
	useSetLastCreatedDateMutation,
} from "../features/meta/metaApi";
import { startOfDay } from "../utils/timeUtils";
import { useDispatch } from "react-redux";
import { setPastStats } from "../features/stats/statsSlice";
import { setRemainingWeeklyTasks } from "../features/calendar/calendarSlice";

interface Props {
	children: ReactNode;
}

const DataLoader = ({ children }: Props) => {
	const dispatch = useDispatch();
	const {
		data: habits,
		isLoading: loadingHabits,
		error: errorHabits,
	} = useGetHabitsQuery();

	const {
		data: tasksToday,
		isLoading: loadingTasks,
		error: errorTasks,
	} = useGetDailyTasksQuery(undefined, { skip: loadingHabits });

	const [
		createDailyTasks,
		{ isLoading: loadingCreateTasks, error: errorCreateTasks },
	] = useCreateDailyTasksMutation();

	const {
		data: metaData,
		isLoading: loadingMeta,
		error: errorMeta,
	} = useGetMetaQuery();

	const [
		setLastCreatedDate,
		{ isLoading: loadingSetMeta, error: errorSetMeta },
	] = useSetLastCreatedDateMutation();

	const { data: pastTasks, isLoading: loadingPastTasks } =
		useGetTasksByRangeQuery();

	useEffect(() => {
		if (habits && !loadingHabits) {
			console.log("DataLoader - Dispatching setRemainingWeeklyTasks");
			dispatch(setRemainingWeeklyTasks(habits));
		}
	}, [habits, loadingHabits, dispatch]);

	useEffect(() => {
		if (pastTasks && !loadingPastTasks) {
			console.log("DataLoader - Dispatching setPastStats");
			dispatch(setPastStats(pastTasks));
		}
	}, [loadingPastTasks, pastTasks, dispatch]);

	useEffect(() => {
		if (
			!loadingMeta &&
			!loadingHabits &&
			habits &&
			metaData?.userId &&
			metaData.lastCreatedDate !== startOfDay()
		) {
			console.log("DataLoader - creating daily tasks.");
			try {
				createDailyTasks(habits);
				setLastCreatedDate(metaData.userId);
			} catch (e) {
				handleError(
					`DataLoader failed to create tasks and update meta data. ${e} `
				);
			}
		}
	}, [
		loadingMeta,
		metaData,
		createDailyTasks,
		habits,
		loadingHabits,
		setLastCreatedDate,
	]);

	const isLoading =
		loadingHabits ||
		loadingTasks ||
		loadingCreateTasks ||
		loadingMeta ||
		loadingSetMeta;
	const error =
		errorHabits || errorTasks || errorCreateTasks || errorMeta || errorSetMeta;

	useEffect(() => {
		if (error) {
			handleError(error);
		}
	}, [error]);

	if (isLoading) return <Loading />;
	//console.log("habits", habits);
	//console.log("Tasks Today", tasksToday);
	//console.log("pastTasks ", pastTasks);

	return <>{children}</>;
};

export default DataLoader;
