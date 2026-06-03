import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Days, HabitChip } from "./HabitCard";
import PageNav from "../../components/PageNav";
import { isGoodHabit } from "../../utils/types";
import { useDeleteHabitMutation, useGetHabitsQuery } from "./habitsApi";
import {
	useDeleteAllTasksMutation,
	useGetDailyTasksQuery,
	useGetTasksByRangeQuery,
} from "../tasks/tasksApi";
import dayjs from "dayjs";
import Loading from "../../components/Loading";
import { useMemo } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { getGraphCompRate } from "../../utils/helpers";
import { useDialogModal } from "../modal/DialogModal";
import { SectionContainer } from "./HabitForm";
import PageWrapper from "../../components/PageWrapper";
import Graph from "../../components/Graph";
import { TUTORIAL_SECTIONS } from "../tutorial/TutorialButton";

const HabitDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { openDialog } = useDialogModal();
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
