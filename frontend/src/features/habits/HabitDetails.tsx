import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Days } from "../../components/HabitCard";
import PageNav from "../../components/PageNav";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { formatTime } from "../../utils/timeUtils";
import { deleteHabit } from "./habitsSlice";
import { isGoodHabit } from "../../utils/types";
import { deleteTasks } from "../tasks/tasksSlice";

const HabitDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const habits = useSelector((state: RootState) => state.habits);

	if (!id) return <div>No Habit Selected.</div>;

	const habit = habits.find((habit) => habit.id === id);

	if (!habit) return <div>Habit not found.</div>;

	const handleDelete = () => {
		dispatch(deleteHabit(habit.id));
		dispatch(deleteTasks(habit));
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
						<Box key={i}>
							{new Date(formatTime(el.time)).toLocaleTimeString()}
						</Box>
					))}
			</Typography>

			<div></div>
			<Button onClick={handleDelete}>delete</Button>
		</Paper>
	);
};

export default HabitDetails;
