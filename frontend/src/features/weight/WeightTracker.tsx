import { Box, Button, Chip, Typography } from "@mui/material";
import {
	useEditTaskMutation,
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
} from "../tasks/tasksApi";
import { CounterTask, PresetId } from "../../utils/types";
import { SectionContainer } from "../habits/HabitForm";
import NumberInput from "../../components/NumberInput";
import { useEffect, useMemo, useState } from "react";
import PageNav from "../../components/PageNav";
import PageWrapper from "../../components/PageWrapper";
import Graph from "../../components/Graph";
import { dayBefore, startOfDay } from "../../utils/timeUtils";
import { getGraphCompRate } from "../../utils/helpers";
import dayjs from "dayjs";

const WeightTracker = () => {
	const [newWeight, setNewWeight] = useState(0);
	const [editTask] = useEditTaskMutation();
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

	// Most recent previously-logged weight, for comparison.
	const prevTask = useMemo(
		() =>
			[...pastTasks]
				.filter((el) => el.complete && el.count !== 0)
				.sort(
					(a, b) =>
						new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
				)[0],
		[pastTasks]
	);

	const loggedToday = !!task?.complete && task.count !== 0;
	const isSaved = loggedToday && newWeight === task.count;
	const delta =
		prevTask && newWeight ? Number((newWeight - prevTask.count).toFixed(2)) : 0;

	// The value to revert to: today's logged weight, otherwise the prefill.
	const resetValue = loggedToday ? task.count : prevTask?.count ?? 0;

	const prevLabel = prevTask
		? dayjs(prevTask.dateTime).isSame(dayBefore(), "day")
			? "Yesterday"
			: dayjs(prevTask.dateTime).format("MMM D")
		: "";

	const handleSetWeight = () => {
		if (!newWeight) return;
		editTask({ ...task, count: newWeight, complete: true });
	};

	// Never leave the field at an empty 0 — restore the baseline on blur.
	const handleBlur = () => {
		if (!newWeight) setNewWeight(resetValue);
	};

	useEffect(() => {
		if (!task) return;
		// Prefill with today's logged weight, otherwise the last recorded
		// weight so the field is never a bare 0 to adjust from.
		if (task.complete && task.count !== 0) setNewWeight(task.count);
		else if (prevTask) setNewWeight(prevTask.count);
	}, [task, prevTask]);

	const graphData = useMemo(() => {
		if (task) {
			const allTasks = [...pastTasks, task];

			const compRate = getGraphCompRate(allTasks);

			const weight = allTasks
				.filter((el) => el.count !== 0 && el.complete)
				.sort(
					(a, b) =>
						new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
				)
				.map((el) => ({ date: el.dateTime, value: Math.round(el.count) }));
			return { compRate, weight };
		}
		const def = [{ date: startOfDay(), value: 0 }];
		return { compRate: def, weight: def };
	}, [pastTasks, task]);

	return (
		<PageWrapper>
			<PageNav title="Weight Tracker" back />
			<Box className="flex-around col full-w full-h">
				<SectionContainer className="flex-center col gap2" fullWidth>
					<Box className="flex-center col gap1">
						<Typography variant="subtitle2" color="text.secondary">
							{dayjs().format("dddd, MMM D")}
						</Typography>
						<Chip
							size="small"
							label={loggedToday ? "Logged today" : "Not logged yet"}
							color={loggedToday ? "success" : "warning"}
							variant={loggedToday ? "filled" : "outlined"}
						/>
					</Box>

					<NumberInput
						value={newWeight}
						onChange={setNewWeight}
						onBlur={handleBlur}
						max={999}
						min={0}
						sx={{ width: "100px" }}
						fontSize="20px"
						acceptDecimals
					/>

					{prevTask && (
						<Box className="flex-center gap2">
							<Typography variant="body2" color="text.secondary">
								{prevLabel}: {prevTask.count}
							</Typography>
							{delta !== 0 && (
								<Typography
									variant="body2"
									sx={{
										color: delta > 0 ? "error.main" : "success.main",
										fontWeight: 600,
									}}
								>
									{delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
								</Typography>
							)}
						</Box>
					)}

					<Box className="flex-center gap2">
						<Button
							variant="outlined"
							onClick={() => setNewWeight(resetValue)}
							disabled={newWeight === resetValue}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							onClick={handleSetWeight}
							disabled={!newWeight || isSaved}
							color={isSaved ? "success" : "primary"}
						>
							{isSaved ? "✓ Saved for today" : "Save"}
						</Button>
					</Box>
				</SectionContainer>

				<SectionContainer fullWidth>
					<Graph graphData={graphData.weight} title="Weight" />
				</SectionContainer>
				<SectionContainer fullWidth>
					<Graph graphData={graphData.compRate} domain={[0, 100]} />
				</SectionContainer>
			</Box>
		</PageWrapper>
	);
};

export default WeightTracker;
