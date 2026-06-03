import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Graph from "../../components/Graph";
import PageNav from "../../components/PageNav";
import PageWrapper from "../../components/PageWrapper";
import ProgressBar from "../../components/ProgressBar";
import { SectionContainer } from "../habits/HabitForm";

import {
	selectCurrentGoal,
	selectCurrentStats,
	selectStats,
} from "./statsSelectors";
import { useMemo, useRef, useState } from "react";
import { startOfDay } from "../../utils/timeUtils";
import { Box, Chip, Slider, Typography } from "@mui/material";
import {
	CheckCircleTwoTone,
	EmojiEventsTwoTone,
	LocalFireDepartmentTwoTone,
} from "@mui/icons-material";
import { useThemeMode } from "../../hooks/ThemeProvider";
import { useGetMetaQuery, useSetGoalMutation } from "../meta/metaApi";
import { useGetHabitsQuery } from "../habits/habitsApi";
import {
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
} from "../tasks/tasksApi";
import { displayTitle, getStreaks } from "../../utils/helpers";
import { TUTORIAL_SECTIONS } from "../tutorial/TutorialButton";

const StatTile = ({
	icon,
	value,
	label,
}: {
	icon: React.ReactNode;
	value: string | number;
	label: string;
}) => (
	<Box className="flex-center col" sx={{ gap: "2px" }}>
		<Box className="flex-center gap1" sx={{ color: "primary.main" }}>
			{icon}
			<Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1 }}>
				{value}
			</Typography>
		</Box>
		<Typography
			variant="caption"
			color="text.secondary"
			sx={{ textAlign: "center" }}
		>
			{label}
		</Typography>
	</Box>
);

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
	const navigate = useNavigate();
	const sentReq = useRef<NodeJS.Timeout | undefined>(undefined);

	const { data: metaData } = useGetMetaQuery();
	const [setGoal] = useSetGoalMutation();

	const { data: habits = [] } = useGetHabitsQuery();
	const { data: rangeData } = useGetTasksByRangeQuery();
	const { data: dailyTasks = [] } = useGetDailyTasksQuery();

	const habitStats = useMemo(() => {
		const byHabit = rangeData?.dataByHabitId ?? {};
		return habits
			.map((habit) => {
				const tasks = [
					...(byHabit[habit.id] ?? []),
					...dailyTasks.filter((t) => t.habitId === habit.id),
				];
				const done = tasks.filter((t) => t.complete).length;
				const completionRate =
					tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
				const { current, best } = getStreaks(tasks);
				return { habit, done, completionRate, current, best };
			})
			.filter((s) => s.done > 0 || s.completionRate > 0);
	}, [habits, rangeData, dailyTasks]);

	const totals = useMemo(() => {
		const totalCompletions = habitStats.reduce((a, s) => a + s.done, 0);
		const longestStreak = habitStats.reduce((a, s) => Math.max(a, s.best), 0);
		return { totalCompletions, longestStreak, habitCount: habitStats.length };
	}, [habitStats]);

	const topHabits = useMemo(
		() =>
			[...habitStats]
				.sort((a, b) => b.completionRate - a.completionRate)
				.slice(0, 3),
		[habitStats],
	);

	const topStreaks = useMemo(
		() =>
			[...habitStats]
				.filter((s) => s.current > 0)
				.sort((a, b) => b.current - a.current)
				.slice(0, 3),
		[habitStats],
	);

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
		<PageWrapper sx={{ justifyContent: "flex-start", overflowY: "auto" }}>
			<PageNav title="Stats" back tutorialSection={TUTORIAL_SECTIONS.stats} />

			{habitStats.length > 0 && (
				<SectionContainer fullWidth title="Highlights">
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: 1,
							width: "100%",
							py: 1,
						}}
					>
						<StatTile
							icon={<CheckCircleTwoTone fontSize="small" />}
							value={totals.habitCount}
							label="Habits tracked"
						/>
						<StatTile
							icon={<EmojiEventsTwoTone fontSize="small" />}
							value={totals.totalCompletions}
							label="Completions"
						/>
						<StatTile
							icon={<LocalFireDepartmentTwoTone fontSize="small" />}
							value={totals.longestStreak}
							label="Longest streak"
						/>
					</Box>
				</SectionContainer>
			)}

			{topHabits.length > 0 && (
				<SectionContainer fullWidth title="Top Habits">
					{topHabits.map((s, i) => (
						<Box
							key={s.habit.id}
							className="flex-center gap2"
							sx={{ width: "100%", cursor: "pointer", py: 0.25 }}
							onClick={() => navigate(`/${s.habit.id}`)}
						>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ width: "16px" }}
							>
								{i + 1}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									flex: 1,
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{displayTitle(s.habit)}
							</Typography>
							<Box sx={{ width: "35%" }}>
								<ProgressBar completionRate={s.completionRate} />
							</Box>
							<Typography
								variant="body2"
								sx={{ fontWeight: "bold", width: "40px", textAlign: "right" }}
							>
								{s.completionRate}%
							</Typography>
						</Box>
					))}
				</SectionContainer>
			)}

			{topStreaks.length > 0 && (
				<SectionContainer fullWidth title="Best Streaks">
					{topStreaks.map((s) => (
						<Box
							key={s.habit.id}
							className="flex-between gap2"
							sx={{ width: "100%", cursor: "pointer", py: 0.25 }}
							onClick={() => navigate(`/${s.habit.id}`)}
						>
							<Typography
								variant="body2"
								sx={{
									flex: 1,
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{displayTitle(s.habit)}
							</Typography>
							<Chip
								size="small"
								color="warning"
								variant="outlined"
								icon={<LocalFireDepartmentTwoTone fontSize="small" />}
								label={s.current}
								sx={{ flexShrink: 0 }}
							/>
						</Box>
					))}
				</SectionContainer>
			)}

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
