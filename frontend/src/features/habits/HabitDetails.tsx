import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Days } from "./HabitCard";
import PageNav from "../../components/PageNav";
import { isGoodHabit } from "../../utils/types";
import { useDeleteHabitMutation, useGetHabitsQuery } from "./habitsApi";
import { useDeleteAllTasksMutation } from "../tasks/tasksApi";
import dayjs from "dayjs";
import Loading from "../../components/Loading";

const HabitDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();

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
		<Paper sx={{ height: "100%", p: 1 }}>
			{/* top nav */}
			<PageNav back={true} title="Details" />
			<Button onClick={() => navigate("edit")}>Edit</Button>
			{/* body */}
			<Typography variant="h3">{habit.title}</Typography>
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

			<div></div>
			<Button onClick={handleDelete}>delete</Button>
		</Paper>
	);
};

export default HabitDetails;
