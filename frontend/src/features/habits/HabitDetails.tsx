import {
	Box,
	Button,
	Divider,
	Paper,
	Typography,
	useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Days, HabitChip } from "./HabitCard";
import PageNav from "../../components/PageNav";
import { isGoodHabit } from "../../utils/types";
import { useDeleteHabitMutation, useGetHabitsQuery } from "./habitsApi";
import {
	useDeleteAllTasksMutation,
	useGetTasksByRangeQuery,
} from "../tasks/tasksApi";
import dayjs from "dayjs";
import Loading from "../../components/Loading";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Label,
} from "recharts";
import { useMemo } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { useThemeMode } from "../../hooks/ThemeProvider";
import { formatLabel } from "../../utils/helpers";
import { useDialogModal } from "../modal/DialogModal";

const HabitDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { openDialog } = useDialogModal();
	//const theme = useTheme();
	const { isLight, theme } = useThemeMode();

	const { data: pastTasks } = useGetTasksByRangeQuery();

	const history = useMemo(
		() => (id ? pastTasks?.dataByHabitId[id] ?? [] : []),
		[id, pastTasks]
	);

	const {
		data: habits,
		isLoading: loadingHabits,
		error: errorHabits,
	} = useGetHabitsQuery();
	const [
		deleteHabit,
		{
			isLoading: delHabitLoading,
			isSuccess: delHabitSuccess,
			error: delHabitError,
		},
	] = useDeleteHabitMutation();

	const [
		deleteTask,
		{
			isLoading: delTaskLoading,
			isSuccess: delTaskSuccess,
			error: delTaskError,
		},
	] = useDeleteAllTasksMutation();

	const graphData = useMemo(() => {
		let rate = 0;
		return [...history]
			.sort(
				(a, b) =>
					new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
			)
			.map((el, i, arr) => {
				rate += el.complete ? 1 : 0;
				const compRate = Math.round((rate / (i + 1)) * 100);
				return { date: el.dateTime, compRate };
			});
	}, [history]);

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
			// content: (
			// 	<>
			// 		<Typography sx={{ textAlign: "center" }}></Typography>
			// 	</>
			// ),
			message:
				"Deleting this Habit is permanent and will also delete all history and tasks associated with it.",
			confirmDef: true,
		});
	};

	return (
		<Box
			className="flex-center col gap3 full-w full-h"
			sx={{ p: 1, justifyContent: "flex-start" }}
		>
			{/* top nav */}
			<PageNav back={true} title="Details" />
			<Box className="flex-around col gap4 full-w" sx={{ flex: 1, p: 1 }}>
				<Paper
					className="full-w flex-center col gap3"
					sx={{ flex: 1, justifyContent: "flex-start" }}
				>
					<Box className="flex-between full-w" sx={{ p: 1 }}>
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
					<Typography variant="h5">{habit.title}</Typography>
					<Typography variant="h6" className="flex gap3">
						<Days days={habit.daysOfWeek} />
					</Typography>

					{isGoodHabit(habit) &&
						habit.timeOfDay.map((el, i) => (
							<Box key={i}>{dayjs(el.time).format("h:mm A")}</Box>
						))}
				</Paper>
				<Paper className="full-w " sx={{ p: 2 }}>
					<ResponsiveContainer width="100%" height={200}>
						<LineChart data={graphData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="date"
								tickFormatter={(value) => dayjs(value).format("MM/DD")}
								tick={{ fill: theme.palette.primary.main, fontSize: 12 }}
							/>
							<YAxis
								dataKey="compRate"
								domain={[0, 100]}
								tick={{ fill: theme.palette.primary.main, fontSize: 12 }}
							>
								<Label
									value="Completion (%)"
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
								dataKey="compRate"
								stroke={isLight ? "#8884d8" : theme.palette.secondary.main}
								strokeWidth={3}
								dot={false}
								activeDot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Paper>
			</Box>
		</Box>
	);
};

export default HabitDetails;
