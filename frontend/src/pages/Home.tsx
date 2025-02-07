import { Box, Button } from "@mui/material";
import PageNav from "../components/PageNav";
import GoodTasksToday from "../features/tasks/GoodTasksToday";
import CounterTasksToday from "../features/tasks/CounterTasksToday";
import { useDispatch, useSelector } from "react-redux";
import {
	selectHabits,
	selectTasksToday,
} from "../features/legacy/oldSelectors";
import { addDailyTasks } from "../features/legacy/tasksSlice";
import BadTasksToday from "../features/tasks/BadTasksToday";
import { useState } from "react";

const Home = () => {
	const dispatch = useDispatch();
	const habits = useSelector(selectHabits);
	const tasksToday = useSelector(selectTasksToday);
	const [tab, setTab] = useState(false);

	if (!tasksToday && habits) {
		dispatch(addDailyTasks({ habits: habits }));
	}
	return (
		<Box sx={{ width: "100%" }}>
			<PageNav title="Home" />
			<Box className="flex-column">
				<Box sx={{ height: "100%", overflow: "hidden", width: "100%" }}>
					<CounterTasksToday />
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
					{!tab ? <GoodTasksToday /> : <BadTasksToday />}
				</Box>
			</Box>
		</Box>
	);
};

export default Home;
