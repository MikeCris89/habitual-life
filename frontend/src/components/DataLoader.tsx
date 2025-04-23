import { ReactNode, useCallback, useRef } from "react";
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
import {
	useClearDailyBasketsMutation,
	useGetBasketsQuery,
} from "../features/calories/food/foodApi";
import useVisibilityEffect from "../hooks/useVisibilityEffect";
import { dbPromise } from "../utils/indexedDb";

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

	const {
		data: baskets,
		isLoading: loadingBaskets,
		error: errorBaskets,
	} = useGetBasketsQuery();

	const [clearDailyBaskets] = useClearDailyBasketsMutation();

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

	const createTasks = useCallback(async () => {
		console.log("createTasks trigger", metaData?.lastCreatedDate);
		if (
			metaData?.userId &&
			metaData.lastCreatedDate !== startOfDay() &&
			habits &&
			baskets &&
			!createRef.current
		) {
			console.log("Tasks not created for today. ");
			if (createRef.current) return;
			createRef.current = true;
			console.log("creating daily tasks.");
			try {
				if (habits && habits.length) {
					await createDailyTasks(habits);
				}
				if (baskets && baskets.length) {
					await clearDailyBaskets(undefined);
				}
				await setLastCreatedDate({
					userId: metaData.userId,
					date: startOfDay(),
				});
			} catch (e) {
				handleError(
					`DataLoader failed to create tasks and update meta data. ${e} `
				);
			} finally {
				createRef.current = false;
			}
		}
	}, [
		baskets,
		habits,
		clearDailyBaskets,
		setLastCreatedDate,
		createDailyTasks,
		metaData?.userId,
		metaData?.lastCreatedDate,
	]);

	useVisibilityEffect(createTasks);

	useEffect(() => {
		createTasks();
	}, [createTasks]);

	const isLoading =
		loadingHabits ||
		loadingTasks ||
		loadingCreateTasks ||
		loadingMeta ||
		loadingSetMeta ||
		loadingPastTasks ||
		loadingBaskets;

	const error =
		errorHabits ||
		errorTasks ||
		errorCreateTasks ||
		errorMeta ||
		errorSetMeta ||
		errorPastTasks ||
		errorBaskets;

	useEffect(() => {
		if (error) {
			handleError("Error in DataLoader", error);
		}
	}, [error]);

	console.log("DataLoader Rendering");

	if (process.env.NODE_ENV === "development") {
		//@ts-ignore
		window.dbPromise = dbPromise;
	}

	if (isLoading) return <Loading />;
	//console.log("habits", habits);
	//console.log("Tasks Today", tasksToday);
	//console.log("pastTasks ", pastTasks);

	return <>{children}</>;
};

export default DataLoader;
