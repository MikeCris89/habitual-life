import { Box } from "@mui/material";
import CounterTasksToday from "../features/tasks/CounterTasksToday";
import StatsSummary from "../features/stats/StatsSummary";
import GoodBadSwitcher from "../features/tasks/GoodBadSwitcher";
import PageWrapper from "../components/PageWrapper";

const Home = () => {
	console.log("Homepage render ");

	return (
		// <Box
		// 	sx={{
		// 		overflow: "hidden",
		// 		flex: 1,
		// 		height: "100%",
		// 		minHeight: 0,
		// 		p: "5px 5px",
		// 	}}
		// 	className="flex-center col full-w fullh"
		// >
		<PageWrapper>
			<StatsSummary />

			<CounterTasksToday />

			<GoodBadSwitcher />
		</PageWrapper>
	);
};

export default Home;
