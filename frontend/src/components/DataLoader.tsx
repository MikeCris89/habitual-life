import { ReactNode, useRef } from "react";
import {
	useGetHabitsQuery,
	useLazyGetHabitsQuery,
} from "../features/habits/habitsApi";
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

interface Props {
	children: ReactNode;
}

const DataLoader = ({ children }: Props) => {
	const dispatch = useDispatch();
	const createRef = useRef(false);

	const {
		data: metaData,
		isLoading: loadingMeta,
		error: errorMeta,
	} = useGetMetaQuery();

	const {
		data: tasksToday,
		isLoading: loadingTasks,
		error: errorTasks,
	} = useGetDailyTasksQuery();

	// const [fetchHabits, { isFetching: loadingHabits, error: errorHabits }] =
	// 	useLazyGetHabitsQuery();

	const {
		data: habits,
		isLoading: loadingHabits,
		error: errorHabits,
	} = useGetHabitsQuery();

	const [
		createDailyTasks,
		{ isLoading: loadingCreateTasks, error: errorCreateTasks },
	] = useCreateDailyTasksMutation();

	const [
		setLastCreatedDate,
		{ isLoading: loadingSetMeta, error: errorSetMeta },
	] = useSetLastCreatedDateMutation();

	const {
		data: pastTasks,
		isLoading: loadingPastTasks,
		error: errorPastTasks,
	} = useGetTasksByRangeQuery();

	useEffect(() => {
		if (pastTasks) {
			console.log("DataLoader - Dispatching setPastStats", pastTasks);
			dispatch(setPastStats(pastTasks.dataArray));
		}
	}, [pastTasks, dispatch]);

	useEffect(() => {
		const createTasks = async () => {
			if (createRef.current) return;
			createRef.current = true;
			console.log("creating daily tasks.");
			try {
				if (habits && habits.length) {
					await createDailyTasks(habits);
				}
				await setLastCreatedDate(metaData.userId);
			} catch (e) {
				handleError(
					`DataLoader failed to create tasks and update meta data. ${e} `
				);
			} finally {
				createRef.current = false;
			}
		};
		if (
			metaData?.userId &&
			metaData.lastCreatedDate !== startOfDay() &&
			habits &&
			!createRef.current
		) {
			console.log("Tasks not created for today. ");
			createTasks();
		}
	}, [metaData, createDailyTasks, setLastCreatedDate, habits]);

	const isLoading =
		loadingHabits ||
		loadingTasks ||
		loadingCreateTasks ||
		loadingMeta ||
		loadingSetMeta ||
		loadingPastTasks;

	const error =
		errorHabits ||
		errorTasks ||
		errorCreateTasks ||
		errorMeta ||
		errorSetMeta ||
		errorPastTasks;

	useEffect(() => {
		if (error) {
			handleError(error);
		}
	}, [error]);

	console.log("DataLoader Rendering");

	if (isLoading) return <Loading />;
	//console.log("habits", habits);
	//console.log("Tasks Today", tasksToday);
	//console.log("pastTasks ", pastTasks);

	return <>{children}</>;
};

export default DataLoader;
