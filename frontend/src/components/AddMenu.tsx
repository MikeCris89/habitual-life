import { Box, Button, IconButton, SxProps, Typography } from "@mui/material";
import { HabitTypes, PresetId } from "../utils/types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../features/modal/modalSlice";
import {
	useAddHabitMutation,
	useGetHabitsQuery,
} from "../features/habits/habitsApi";
import Loading from "./Loading";
import { LocalDining, MonitorWeight } from "@mui/icons-material";
import { initHabit, initTypes } from "../features/habits/HabitForm";
import { useCreateDailyTasksMutation } from "../features/tasks/tasksApi";

const initWeightHabit = {
	...initHabit,
	...initTypes.counter,
	title: "Weight Tracker",
	id: PresetId.weightTracker,
};

const AddMenu = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { data: habits, isLoading } = useGetHabitsQuery();

	const [addHabit] = useAddHabitMutation();
	const [createTask] = useCreateDailyTasksMutation();

	const handleMenuNav = (type: string) => {
		navigate(`add/${type}`);
		dispatch(closeModal());
	};

	const handleAddWeightHabit = async () => {
		if (habits) {
			const habitExists = habits.find((el) => el.id === PresetId.weightTracker);
			if (!habitExists) {
				await addHabit(initWeightHabit);
				await createTask(initWeightHabit);
			}
			navigate(`${PresetId.weightTracker}`);
			dispatch(closeModal());
		}
	};

	if (isLoading) return <Loading />;

	const isHabitCreated = (habitId: string): boolean => {
		if (habits) {
			const habitExists = habits.find((el) => el.id === habitId);
			return !!habitExists;
		}
		return false;
	};

	const presetStyles = (habitCreated: boolean): SxProps => {
		return {
			color: habitCreated ? "gray" : "primary.main",
			borderColor: habitCreated ? "gray" : "primary.main",
			opacity: habitCreated ? 0.6 : 1,
			transition: "0.3s",
			display: "flex",
			gap: "10px",
			alignItems: "center",
		};
	};

	return (
		<Box className="flex-center col gap2" sx={{ "& > *": { width: "100%" } }}>
			<Typography variant="body1" sx={{ textAlign: "center" }}>
				Custom
			</Typography>
			<hr />
			<Button variant="outlined" onClick={() => handleMenuNav(HabitTypes.GOOD)}>
				Good Habit
			</Button>
			<Button variant="outlined" onClick={() => handleMenuNav(HabitTypes.BAD)}>
				Bad Habit
			</Button>
			{/* KEEP FOR NOW */}
			{/* <Button
				variant="outlined"
				onClick={() => handleMenuNav(HabitTypes.COUNTER)}
			>
				Counter Habit
			</Button> */}

			<Typography variant="body1" sx={{ textAlign: "center" }}>
				Presets
			</Typography>
			<hr />
			{/* <Button
				variant="outlined"
				onClick={() => handleMenuNav(PresetId.calorieCounter)}
				disabled={isHabitCreated(PresetId.calorieCounter)}
				sx={{
					color: isHabitCreated(PresetId.calorieCounter)
						? "gray"
						: "primary.main",
					borderColor: isHabitCreated(PresetId.calorieCounter)
						? "gray"
						: "primary.main",
					opacity: isHabitCreated(PresetId.calorieCounter) ? 0.6 : 1,
					transition: "0.3s ease-in-out",
					"&:hover": {
						backgroundColor: isHabitCreated(PresetId.calorieCounter)
							? "transparent"
							: "primary.light",
					},
				}}
			>
				<LocalDining
					sx={{
						color: isHabitCreated(PresetId.calorieCounter) ? "gray" : "inherit",
						filter: isHabitCreated(PresetId.calorieCounter)
							? "grayscale(100%)"
							: "none",
					}}
				/>
				Calorie Counter
			</Button> */}
			<Button
				variant="outlined"
				onClick={() => handleMenuNav(PresetId.calorieCounter)}
				disabled={isHabitCreated(PresetId.calorieCounter)}
				sx={{
					...presetStyles(isHabitCreated(PresetId.calorieCounter)),
				}}
			>
				<LocalDining />
				Calorie Counter
			</Button>
			<Button
				variant="outlined"
				onClick={handleAddWeightHabit}
				disabled={isHabitCreated(PresetId.weightTracker)}
				sx={{
					...presetStyles(isHabitCreated(PresetId.weightTracker)),
				}}
			>
				<MonitorWeight />
				Weight Tracker
			</Button>
		</Box>
	);
};

export default AddMenu;
