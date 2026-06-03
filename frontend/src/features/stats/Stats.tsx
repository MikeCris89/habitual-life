import { useSelector } from "react-redux";
import Graph from "../../components/Graph";
import PageNav from "../../components/PageNav";
import PageWrapper from "../../components/PageWrapper";
import { SectionContainer } from "../habits/HabitForm";

import {
	selectCurrentGoal,
	selectCurrentStats,
	selectStats,
} from "./statsSelectors";
import { useMemo, useRef, useState } from "react";
import { startOfDay } from "../../utils/timeUtils";
import { Box, Slider, Typography } from "@mui/material";
import { useThemeMode } from "../../hooks/ThemeProvider";
import { useGetMetaQuery, useSetGoalMutation } from "../meta/metaApi";
import { TUTORIAL_SECTIONS } from "../tutorial/TutorialButton";

const marks = [
	{
		value: 50,
		label: "50",
	},
	{
		value: 60,
		label: "60",
	},
	{
		value: 70,
		label: "70",
	},
	{
		value: 80,
		label: "80",
	},
	{
		value: 90,
		label: "90",
	},
];

const Stats = () => {
	const goal = useSelector(selectCurrentGoal);
	const [newGoal, setNewGoal] = useState(goal);
	const history = useSelector(selectStats);
	const currStats = useSelector(selectCurrentStats);
	const { theme } = useThemeMode();
	const sentReq = useRef<NodeJS.Timeout | undefined>(undefined);

	const { data: metaData } = useGetMetaQuery();
	const [setGoal] = useSetGoalMutation();

	const graphData = useMemo(
		() =>
			Object.entries({
				...history.pastStats,
				[startOfDay()]: { completionRate: currStats.completionRate },
			}).map(([date, data]) => ({
				date,
				value: data.completionRate,
			})),
		[history, currStats],
	);

	const handleChange = (value: number) => {
		if (value < 50 || value > 90) return;
		setNewGoal(value);
		if (!metaData) return;
		if (sentReq.current) clearTimeout(sentReq.current);
		sentReq.current = setTimeout(() => {
			setGoal({ userId: metaData.userId, goal: value });
			sentReq.current = undefined;
		}, 500);
	};

	return (
		<PageWrapper sx={{ justifyContent: "space-between" }}>
			<PageNav title="Stats" back tutorialSection={TUTORIAL_SECTIONS.stats} />
			<SectionContainer fullWidth title="Set Goal">
				<Typography variant="h6">Completion Goal</Typography>
				<Box className="flex-center full-w" p={3}>
					<Slider
						valueLabelDisplay="auto"
						defaultValue={goal}
						value={newGoal}
						min={0}
						max={100}
						step={10}
						marks={marks}
						onChange={(e, value) =>
							handleChange(typeof value === "number" ? value : 0)
						}
						track={false}
						sx={{
							"& .MuiSlider-rail": {
								background: `linear-gradient(to right, 
								red 0%,
								red ${newGoal - 30}%,
								orange ${newGoal - 20}%,
								orange ${newGoal - 15}%,
								green ${newGoal - 3}%, 
								green ${newGoal + 3}%, 
								${theme.palette.primary.main} ${newGoal + 15}%,
								${theme.palette.primary.main} 100%)`,
								opacity: 1,
							},
						}}
					/>
				</Box>
			</SectionContainer>
			<SectionContainer fullWidth>
				<Graph graphData={graphData} domain={[0, 100]} />
			</SectionContainer>
		</PageWrapper>
	);
};

export default Stats;
