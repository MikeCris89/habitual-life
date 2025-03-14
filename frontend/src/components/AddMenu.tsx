import { Box, Button, IconButton, Typography } from "@mui/material";
import { HabitTypes, PresetId } from "../utils/types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../features/modal/modalSlice";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import Loading from "./Loading";
import { LocalDining } from "@mui/icons-material";

const AddMenu = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleMenuNav = (type: string) => {
		navigate(`add/${type}`);
		dispatch(closeModal());
	};

	const { data: habits, isLoading } = useGetHabitsQuery();

	if (isLoading) return <Loading />;

	const isHabitCreated = (habitId: string): boolean => {
		if (habits) {
			const habitExists = habits.find((el) => el.id === habitId);
			return !!habitExists;
		}
		return false;
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
			<Button
				variant="outlined"
				onClick={() => handleMenuNav(HabitTypes.COUNTER)}
			>
				Counter Habit
			</Button>

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
					color: isHabitCreated(PresetId.calorieCounter)
						? "gray"
						: "primary.main",
					borderColor: isHabitCreated(PresetId.calorieCounter)
						? "gray"
						: "primary.main",
					opacity: isHabitCreated(PresetId.calorieCounter) ? 0.6 : 1,
					transition: "0.3s",
				}}
			>
				<LocalDining />
				Calorie Counter
			</Button>
		</Box>
	);
};

export default AddMenu;
