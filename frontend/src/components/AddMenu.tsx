import { Box, Button, Typography } from "@mui/material";
import { HabitType, HabitTypes } from "../utils/types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../features/modal/modalSlice";

interface Props {
	callback: (type: HabitType) => void;
}

const AddMenu = ({ callback }: Props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleMenuNav = (type: string) => {
		navigate(`add/${type}`);
		dispatch(closeModal());
	};
	return (
		<Box className="flex-center col gap2" sx={{ "& > *": { width: "100%" } }}>
			<Typography variant="body1" sx={{ textAlign: "center" }}>
				Custom
			</Typography>
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
			<hr />
			<Typography variant="body1" sx={{ textAlign: "center" }}>
				Custom
			</Typography>
			<Button
				variant="outlined"
				onClick={() => handleMenuNav("preset_calories")}
			>
				Calorie Counter
			</Button>
		</Box>
	);
};

export default AddMenu;
