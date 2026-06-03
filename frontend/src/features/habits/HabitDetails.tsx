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
	AvTimerTwoTone,
	CheckCircleTwoTone,
	Delete,
	Edit,
	PinOutlined,
	TimerOutlined,
} from "@mui/icons-material";
import { getGraphCompRate } from "../../utils/helpers";
import { useDialogModal } from "../modal/DialogModal";
import { openModal } from "../modal/modalSlice";
import { setTimer } from "../timer/timerSlice";
import { SectionContainer } from "./HabitForm";
import PageWrapper from "../../components/PageWrapper";
import Graph from "../../components/Graph";
import { TUTORIAL_SECTIONS } from "../tutorial/TutorialButton";

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
			<SectionContainer fullWidth wrapperSx={{ flex: 1 }}>
				<Box className="flex-between full-w" sx={{ p: 1 }}>
					<HabitChip type={habit.type} />
					<Box className="flex-center gap3" sx={{ justifyContent: "flex-end" }}>
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
				<Typography variant="h5">{habit.title}</Typography>
				<Typography variant="h6" className="flex gap3">
					<Days days={habit.daysOfWeek} />
				</Typography>

				{isGoodHabit(habit) &&
					habit.timeOfDay.map((el, i) => (
						<Box key={i}>{dayjs(el.time).format("h:mm A")}</Box>
					))}

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
			<SectionContainer fullWidth>
				<Graph
					graphData={graphData}
					labelY="Completion (%)"
					domain={[0, 100]}
				/>
			</SectionContainer>
		</PageWrapper>
	);
};

export default HabitDetails;
