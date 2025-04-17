import { Box, Button } from "@mui/material";
import {
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
} from "../tasks/tasksApi";
import { CounterTask, PresetId } from "../../utils/types";
import Loading from "../../components/Loading";
import { SectionContainer } from "../habits/HabitForm";
import NumberInput from "../../components/NumberInput";
import { useMemo, useState } from "react";
import PageNav from "../../components/PageNav";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Label,
} from "recharts";
import { useThemeMode } from "../../hooks/ThemeProvider";
import dayjs from "dayjs";
import PageWrapper from "../../components/PageWrapper";

const WeightTracker = () => {
	const { theme, isLight } = useThemeMode();
	const [newWeight, setNewWeight] = useState(0);
	const { data: task } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [] }) => {
			const result = data.find((el) => el.habitId === PresetId.weightTracker);
			return { data: result as CounterTask };
		},
	});
	const { data: pastTasks = [] } = useGetTasksByRangeQuery(undefined, {
		selectFromResult: ({ data }) => {
			const result = data?.dataByHabitId[PresetId.weightTracker];
			if (!result) return { data: undefined };
			return { data: result as CounterTask[] };
		},
	});

	const handleSaveWeight = () => {};

	const graphData = useMemo(() => {
		if (task) {
			return [...pastTasks, task]
				.filter((el) => el.count !== 0 && el.complete)
				.sort(
					(a, b) =>
						new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
				)
				.map((el) => ({ date: el.dateTime, weight: Math.round(el.count) }));
		}
		return undefined;
	}, [pastTasks, task]);

	return (
		<PageWrapper>
			<PageNav title="Weight Tracker" back />
			<Box className="flex-around col full-w full-h">
				<SectionContainer className="flex-center col gap3" fullWidth>
					<NumberInput
						value={newWeight}
						onChange={setNewWeight}
						max={999}
						min={0}
						sx={{ width: "100px" }}
						fontSize="20px"
						acceptDecimals
					/>
					<Button variant="contained">Save</Button>
				</SectionContainer>

				<SectionContainer fullWidth>
					<ResponsiveContainer width="100%" height={200}>
						<LineChart data={graphData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="date"
								tickFormatter={(value) => dayjs(value).format("MM/DD")}
								tick={{ fill: theme.palette.primary.main, fontSize: 12 }}
							/>
							<YAxis
								dataKey="weight"
								tick={{ fill: theme.palette.primary.main, fontSize: 12 }}
								domain={["dataMin - 5", "dataMax + 5"]}
							>
								<Label
									value="Weight"
									angle={-90}
									position="insideLeft"
									offset={10}
									style={{
										textAnchor: "middle",
										//fill: isLight ? "#555" : "#ccc", // change text color
										fill: theme.palette.secondary.main,
										fontSize: 12,
										fontWeight: 500,
									}}
								/>
							</YAxis>
							<Line
								type="monotone"
								dataKey="weight"
								stroke={isLight ? "#8884d8" : theme.palette.secondary.main}
								strokeWidth={3}
								dot={false}
								activeDot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</SectionContainer>
			</Box>
		</PageWrapper>
	);
};

export default WeightTracker;
