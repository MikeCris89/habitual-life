import { Box, Button } from "@mui/material";
import GoodTasksToday from "../features/tasks/GoodTasksToday";
import CounterTasksToday from "../features/tasks/CounterTasksToday";
import BadTasksToday from "../features/tasks/BadTasksToday";
import { useState } from "react";
import { useGetDailyTasksQuery } from "../features/tasks/tasksApi";
import { isBadTask, isCounterTask, isGoodTask } from "../utils/types";

const Home = () => {
	const { data: tasksToday = [] } = useGetDailyTasksQuery();

	const [tab, setTab] = useState(false);

	const goodTasks = tasksToday.filter(isGoodTask);
	const badTasks = tasksToday.filter(isBadTask);
	const counterTasks = tasksToday.filter(isCounterTask);

	return (
		<Box
			sx={{ overflow: "hidden", flex: 1, height: "100%", minHeight: 0 }}
			className="flex-center col"
		>
			<Box sx={{ width: "100%" }}>
				<CounterTasksToday tasks={counterTasks} />
			</Box>
			<Box
				sx={{ width: "100%", flex: 1, minHeight: 0, p: 1 }}
				className="flex-center col"
			>
				<Box className="flex-center" sx={{ p: 1 }}>
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
						No-No List
					</Button>
				</Box>
				<Box
					sx={{
						width: "100%",
						minHeight: 0,
						overflowY: "auto",
						height: "100%",
						bgcolor: "grey.200",
						borderRadius: "12px",
						//background: "linear-gradient(to bottom, #f5f7fa, #e6ecf3)",
						//boxShadow:"0px 4px 15px rgba(0, 0, 0, 0.4), 0px 2px 5px rgba(0, 0, 0, 0.2)",
						boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
					}}
				>
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
