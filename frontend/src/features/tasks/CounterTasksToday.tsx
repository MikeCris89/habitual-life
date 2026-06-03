import { Box, Button, Card, Typography } from "@mui/material";
import { CounterTask, isCounterTask, PresetId, Task } from "../../utils/types";
import {
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
	useIncrementCounterMutation,
} from "./tasksApi";
import { LocalDining, Scale } from "@mui/icons-material";
import ProgressBar from "../../components/ProgressBar";
import { getCompletionRate } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const PresetCard = ({
	task,
	pastTasks,
	onClick,
	title,
	icon,
	omitTotal = false,
	displayCount,
}: {
	task: CounterTask;
	pastTasks: Task[];
	onClick: () => void;
	title: string;
	icon?: React.ReactNode;
	omitTotal?: boolean;
	displayCount?: React.ReactNode;
}) => {
	return (
		<Card
			className="flex-between col gap1 full-h"
			sx={{ padding: "3px 6px", minWidth: "100px", cursor: "pointer" }}
			onClick={onClick}
		>
			<Typography variant="body2" sx={{ fontSize: "12px" }}>
				{title}
			</Typography>
			<Box className="flex-around gap2 full-w">
				{icon}

				<Box className="flex-center col">
					<Typography variant="body1">{displayCount ?? task.count}</Typography>
					{!omitTotal && (
						<Typography variant="body2" sx={{ fontSize: "12px" }}>
							/{task.total}
						</Typography>
					)}
				</Box>
			</Box>

			<ProgressBar completionRate={getCompletionRate(pastTasks, task)} />
		</Card>
	);
};

const EMPTY_DATA: Record<string, any> = {};

const CounterTasksToday = () => {
	const navigate = useNavigate();

	const { data: tasks } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [] }) => ({ data: data.filter(isCounterTask) }),
	});

	const { data: habits } = useGetTasksByRangeQuery();
	const { dataByHabitId } = habits ?? EMPTY_DATA;

	const [incrementTask] = useIncrementCounterMutation();

	const sortedTasks = useMemo(() => {
		const timeSort = (task: Task) => {
			return new Date(dataByHabitId[task.habitId]).getTime();
		};
		return tasks && dataByHabitId
			? [...tasks].sort((a, b) => timeSort(b) - timeSort(a))
			: [];
	}, [tasks, dataByHabitId]);

	return (
		<Box
			sx={{
				width: "100%",
			}}
		>
			{tasks && tasks.length > 0 && (
				<Box
					className="flex-center gap4"
					sx={{
						height: "100%",
						width: "100%",
						px: 1,
						py: 0.5,
					}}
				>
					{sortedTasks.map((task) => {
						// Calorie Counter
						if (task.habitId === PresetId.calorieCounter) {
							return (
								<PresetCard
									key={task.id}
									task={task}
									pastTasks={dataByHabitId?.[task.habitId] ?? []}
									onClick={() => navigate(`/${PresetId.calorieCounter}/log`)}
									title="Calories"
									icon={<LocalDining />}
									displayCount={task.count !== 0 ? task.count : "–"}
								/>
							);
						}
						// Weight Tracker
						if (task.habitId === PresetId.weightTracker) {
							return (
								<PresetCard
									key={task.id}
									task={task}
									pastTasks={dataByHabitId?.[task.habitId] ?? []}
									onClick={() => navigate(`/${PresetId.weightTracker}/log`)}
									title="Weight"
									icon={<Scale />}
									omitTotal
									displayCount={task.complete && task.count !== 0 ? task.count : "–"}
								/>
							);
						}
						return (
							<Box
								className="flex-center col"
								key={task.id}
								onClick={() => incrementTask({ task })}
							>
								<>
									<Box className="flex-center">
										<Button
											variant="outlined"
											className="flex-center"
											sx={{
												borderRadius: "50%",
												minWidth: 30,
												minHeight: 30,
												margin: "auto",
											}}
										>
											{task.count}
										</Button>
									</Box>
									<Typography sx={{ fontSize: "12px", textAlign: "center" }}>
										{task.title}
									</Typography>
								</>
							</Box>
						);
					})}
				</Box>
			)}
		</Box>
	);
};

export default CounterTasksToday;
