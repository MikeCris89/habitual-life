import { Box } from "@mui/material";
import CounterTasksToday from "../features/tasks/CounterTasksToday";
import StatsSummary from "../features/stats/StatsSummary";
import GoodBadSwitcher from "../features/tasks/GoodBadSwitcher";
import PageWrapper from "../components/PageWrapper";
import PageNav from "../components/PageNav";
import { TUTORIAL_SECTIONS } from "../features/tutorial/TutorialButton";

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
			<PageNav title="Home" tutorialSection={TUTORIAL_SECTIONS.overview} />
			<StatsSummary />

			<CounterTasksToday />

			<GoodBadSwitcher />
		</PageWrapper>
	);
};

export default Home;
