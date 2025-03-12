import { Box } from "@mui/material";
import CounterTasksToday from "../features/tasks/CounterTasksToday";
import StatsSummary from "../features/stats/StatsSummary";
import GoodBadSwitcher from "../features/tasks/GoodBadSwitcher";

const Home = () => {
	console.log("Homepage render ");

	return (
		<Box
			sx={{ overflow: "hidden", flex: 1, height: "100%", minHeight: 0 }}
			className="flex-center col"
		>
			<StatsSummary />

			<CounterTasksToday />

			<GoodBadSwitcher />
		</Box>
	);
};

export default Home;
