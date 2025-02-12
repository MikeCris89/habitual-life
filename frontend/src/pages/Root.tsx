import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Box } from "@mui/material";
import useDisplay from "../hooks/useDisplay";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import {
	useCreateDailyTasksMutation,
	useGetDailyTasksQuery,
} from "../features/tasks/tasksApi";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { handleError } from "../utils/errors";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

const Root = () => {
	const { isMobile } = useDisplay();

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

	useEffect(() => {
		if (!loadingHabits && habits?.length && tasksToday?.length === 0) {
			console.log("creating tasks");
			createDailyTasks(habits);
		}
	}, [loadingHabits, habits, tasksToday, createDailyTasks]);

	const isLoading = loadingHabits || loadingTasks || loadingCreateTasks;
	const error = errorHabits || errorTasks || errorCreateTasks;

	useEffect(() => {
		if (error) {
			handleError(error);
		}
	}, [error]);

	console.log("habits", habits);
	console.log("tasks", tasksToday);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: isMobile ? "column-reverse" : "column",
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<NavBar isMobile={isMobile} />

			{isLoading ? (
				<Loading />
			) : (
				<Box
					sx={{
						width: "100%",
						height: "100%",
						padding: "5px 10px",
						overflow: "hidden",
						flex: 1,
					}}
				>
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<Outlet />
					</ErrorBoundary>
				</Box>
			)}
		</Box>
	);
};

export default Root;
