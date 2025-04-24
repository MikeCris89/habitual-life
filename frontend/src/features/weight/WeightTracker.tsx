import { Box, Button } from "@mui/material";
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
import { startOfDay } from "../../utils/timeUtils";
import { getGraphCompRate } from "../../utils/helpers";

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

	const handleSetWeight = () => {
		editTask({ ...task, count: newWeight, complete: newWeight ? true : false });
	};

	useEffect(() => {
		if (task) setNewWeight(task.count);
	}, [task]);

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
					<Button variant="contained" onClick={handleSetWeight}>
						Save
					</Button>
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
