import { Box, Button } from "@mui/material";
import PageNav from "../components/PageNav";
import GoodTasksToday from "../features/tasks/GoodTasksToday";
import CounterTasksToday from "../features/tasks/CounterTasksToday";
import BadTasksToday from "../features/tasks/BadTasksToday";
import { useState } from "react";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import {
	useCreateDailyTasksMutation,
	useGetDailyTasksQuery,
} from "../features/tasks/tasksApi";
import { isBadTask, isCounterTask, isGoodTask } from "../utils/types";

const Home = () => {
	const {
		data: habits,
		isLoading: loadingHabits,
		error: errorHabits,
	} = useGetHabitsQuery();
	const {
		data: tasksToday = [],
		isLoading: loadingTasks,
		error: loadingError,
	} = useGetDailyTasksQuery();
	const [
		createDailyTasks,
		{ isLoading: loadingCreateTasks, error: errorCreateTasks },
	] = useCreateDailyTasksMutation();

	const [tab, setTab] = useState(false);

	// if ((!tasksToday || !tasksToday.length) && habits) {
	// 	createDailyTasks(habits);
	// }

	const goodTasks = tasksToday.filter(isGoodTask);
	const badTasks = tasksToday.filter(isBadTask);
	const counterTasks = tasksToday.filter(isCounterTask);

	return (
		<Box sx={{ width: "100%" }}>
			<PageNav title="Home" />
			<Box className="flex-column">
				<Box sx={{ height: "100%", overflow: "hidden", width: "100%" }}>
					<CounterTasksToday tasks={counterTasks} />
				</Box>
				<Box sx={{ width: "80%", margin: "auto" }}>
					<Box className="flex-center">
						<Button
							size="small"
							variant={tab ? "outlined" : "contained"}
							onClick={() => setTab(false)}
						>
							Today
						</Button>
						<Button
							size="small"
							variant={tab ? "contained" : "outlined"}
							onClick={() => setTab(true)}
						>
							No-no List
						</Button>
					</Box>
					{!tab ? (
						<GoodTasksToday tasks={goodTasks} />
					) : (
						<BadTasksToday tasks={badTasks} />
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default Home;
