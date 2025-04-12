import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Days } from "./HabitCard";
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
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	Label,
} from "recharts";
import { useMemo } from "react";
import { Delete, Edit } from "@mui/icons-material";

const HabitDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();

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

	return (
		<Paper
			className="flex-center col full-w full-h"
			sx={{ p: 1, justifyContent: "flex-start" }}
		>
			{/* top nav */}
			<PageNav back={true} title="Details" />
			<Box className="flex gap3 full-w" sx={{ justifyContent: "flex-end" }}>
				<Button
					onClick={() => navigate("edit")}
					endIcon={<Edit fontSize="small" />}
					sx={{ alignItems: "flex-start" }}
				>
					Edit
				</Button>
				<Button
					onClick={handleDelete}
					endIcon={<Delete fontSize="small" color="warning" />}
					sx={{ alignItems: "flex-start" }}
				>
					delete
				</Button>
			</Box>
			{/* body */}
			<Typography variant="h5">{habit.title}</Typography>
			<Typography variant="h6" className="flex gap3">
				<Days days={habit.daysOfWeek} />
			</Typography>
			<Typography variant="h6">
				{habit.type}
				{isGoodHabit(habit) &&
					habit.timeOfDay.map((el, i) => (
						<Box key={i}>{dayjs(el.time).format("h:mm A")}</Box>
					))}
			</Typography>

			<div>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={graphData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickFormatter={(value) => dayjs(value).format("MM/DD")}
						/>
						<YAxis dataKey="compRate" domain={[0, 100]}>
							<Label
								value="Completion (%)"
								angle={-90}
								position="insideLeft"
								offset={10}
								style={{ textAnchor: "middle" }}
							/>
						</YAxis>
						<Line
							type="monotone"
							dataKey="compRate"
							stroke="#8884d8"
							strokeWidth={2}
							dot={false}
							activeDot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</Paper>
	);
};

export default HabitDetails;
