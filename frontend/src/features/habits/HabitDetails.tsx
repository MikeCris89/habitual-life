import { Box, Button, Chip, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Days, HabitChip } from "./HabitCard";
import PageNav from "../../components/PageNav";
import {
	isGoodHabit,
	isGoodTask,
	isNoneTimer,
	isRoundTimer,
} from "../../utils/types";
import { useDeleteHabitMutation, useGetHabitsQuery } from "./habitsApi";
import {
	useCheckOffTaskMutation,
	useDeleteAllTasksMutation,
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
} from "../tasks/tasksApi";
import dayjs from "dayjs";
import Loading from "../../components/Loading";
import { useMemo } from "react";
import {
	AccessTime,
	AvTimerTwoTone,
	Check,
	CheckCircleTwoTone,
	Delete,
	Edit,
	EmojiEventsTwoTone,
	LocalFireDepartmentTwoTone,
	PercentTwoTone,
	PinOutlined,
	TimerOutlined,
} from "@mui/icons-material";
import { displayTitle, getGraphCompRate, getStreaks } from "../../utils/helpers";
import { useDialogModal } from "../modal/DialogModal";
import { openModal } from "../modal/modalSlice";
import { setTimer } from "../timer/timerSlice";
import { SectionContainer } from "./HabitForm";
import PageWrapper from "../../components/PageWrapper";
import Graph from "../../components/Graph";
import { TUTORIAL_SECTIONS } from "../tutorial/TutorialButton";

const StatItem = ({
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
		<Typography variant="caption" color="text.secondary">
			{label}
		</Typography>
	</Box>
);

const HabitDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { openDialog } = useDialogModal();
	const [checkOffTask] = useCheckOffTaskMutation();
	const { data: dailyTasks = [] } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [] }) => {
			const resp = data.filter((el) => el.habitId === id);
			return { data: resp };
		},
	});
	const { data: pastTasks } = useGetTasksByRangeQuery();

	const history = useMemo(
		() => (id ? (pastTasks?.dataByHabitId[id] ?? []) : []),
		[id, pastTasks],
	);

	const {
		data: habits,
		isLoading: loadingHabits,
		error: errorHabits,
	} = useGetHabitsQuery();
	const [deleteHabit] = useDeleteHabitMutation();

	const [deleteTask] = useDeleteAllTasksMutation();

	const graphData = useMemo(
		() => getGraphCompRate([...history, ...dailyTasks]),
		[history, dailyTasks],
	);

	const stats = useMemo(() => {
		const all = [...history, ...dailyTasks];
		if (!all.length) return null;

		const { current, best } = getStreaks(all);
		const totalDone = all.filter((task) => task.complete).length;
		const completionRate = Math.round((totalDone / all.length) * 100);

		return { current, best, totalDone, completionRate };
	}, [history, dailyTasks]);

	if (!id) return <div>No Habit Selected.</div>;
	if (loadingHabits) return <Loading />;
	if ((!loadingHabits && !habits) || errorHabits)
		throw new Error(`Error fetching habits ${errorHabits ?? ""}`);

	const habit = habits?.find((habit) => habit.id === id);

	if (!habit) return <div>Habit not found.</div>;

	// A representative good task carries the timer config for today.
	const timerTask = dailyTasks.find(
		(task) => isGoodTask(task) && !isNoneTimer(task.timer),
	);
	const completedToday =
		dailyTasks.length > 0 && dailyTasks.every((task) => task.complete);

	const startTimer = () => {
		if (!timerTask || !isGoodTask(timerTask)) return;
		dispatch(setTimer(timerTask.timer));
		dispatch(
			openModal({
				component: isRoundTimer(timerTask.timer) ? "roundTimer" : "singleTimer",
				props: { task: timerTask },
			}),
		);
	};

	const handleCheckOff = () => {
		// Toggle every task for today to the opposite of the current state.
		dailyTasks.forEach((task) => {
			if (task.complete === completedToday) checkOffTask(task);
		});
	};

	const handleDelete = () => {
		deleteHabit(habit.id);
		deleteTask(habit);
		navigate(-1);
	};

	const handleClickDelete = () => {
		openDialog({
			title: "Delete Habit",
			onConfirm: handleDelete,
			message:
				"Deleting this Habit is permanent and will also delete all history and tasks associated with it.",
			confirmDef: true,
		});
	};

	return (
		<PageWrapper>
			<PageNav
				back={true}
				title="Details"
				tutorialSection={TUTORIAL_SECTIONS.habits}
			/>
			<Box className="flex-between full-w full-h col">
				<SectionContainer fullWidth wrapperSx={{}} paperSx={{ p: 2, pb: 4 }}>
					<Box className="flex-between full-w" sx={{}}>
						<HabitChip type={habit.type} />
						<Box
							className="flex-center gap3"
							sx={{ justifyContent: "flex-end" }}
						>
							<Button
								onClick={handleClickDelete}
								endIcon={<Delete fontSize="small" color="warning" />}
								sx={{ alignItems: "flex-start" }}
							>
								delete
							</Button>
							<Button
								onClick={() => navigate("edit")}
								endIcon={<Edit fontSize="small" />}
								sx={{ alignItems: "flex-start" }}
							>
								Edit
							</Button>
						</Box>
					</Box>
					{/* body */}
					<Box className="flex-center col gap2 full-w">
						<Typography variant="h5" sx={{ textAlign: "center" }}>
							{displayTitle(habit)}
						</Typography>
						<Days days={habit.daysOfWeek} />

						{isGoodHabit(habit) && habit.timeOfDay.length > 0 && (
							<Box className="flex-center gap2" sx={{ flexWrap: "wrap" }}>
								{habit.timeOfDay.map((el, i) => (
									<Chip
										key={i}
										size="small"
										variant="outlined"
										icon={<AccessTime fontSize="small" />}
										label={dayjs(el.time).format("h:mm A")}
									/>
								))}
							</Box>
						)}
					</Box>

					{dailyTasks.length > 0 && (
						<Box className="flex-center col gap2" sx={{ mt: 1 }}>
							<Chip
								size="small"
								label={completedToday ? "Completed today" : "Not completed yet"}
								color={completedToday ? "success" : "warning"}
								variant={completedToday ? "filled" : "outlined"}
							/>
							<Box className="flex-center gap3">
								{timerTask && isGoodTask(timerTask) && (
									<Button
										variant="outlined"
										onClick={startTimer}
										startIcon={
											isRoundTimer(timerTask.timer) ? (
												<>
													<TimerOutlined fontSize="small" />
													<PinOutlined fontSize="small" />
												</>
											) : (
												<AvTimerTwoTone fontSize="small" />
											)
										}
									>
										Start Timer
									</Button>
								)}
								<Button
									variant={completedToday ? "contained" : "outlined"}
									color="success"
									onClick={handleCheckOff}
									startIcon={<CheckCircleTwoTone fontSize="small" />}
								>
									{completedToday ? "Completed" : "Check off"}
								</Button>
							</Box>
						</Box>
					)}
				</SectionContainer>
				{stats && (
					<SectionContainer fullWidth title="Stats">
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 2,
								width: "100%",
								py: 1,
							}}
						>
							<StatItem
								icon={<LocalFireDepartmentTwoTone fontSize="small" />}
								value={stats.current}
								label="Current streak"
							/>
							<StatItem
								icon={<EmojiEventsTwoTone fontSize="small" />}
								value={stats.best}
								label="Best streak"
							/>
							<StatItem
								icon={<CheckCircleTwoTone fontSize="small" />}
								value={stats.totalDone}
								label="Completed"
							/>
							<StatItem
								icon={<Check fontSize="small" />}
								value={`${stats.completionRate}%`}
								label="Completion"
							/>
						</Box>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ textAlign: "center" }}
						>
							Tracking since {dayjs(habit.createdAt).format("MMM D, YYYY")}
						</Typography>
					</SectionContainer>
				)}
				<SectionContainer fullWidth>
					<Graph
						graphData={graphData}
						labelY="Completion (%)"
						domain={[0, 100]}
					/>
				</SectionContainer>
			</Box>
		</PageWrapper>
	);
};

export default HabitDetails;
