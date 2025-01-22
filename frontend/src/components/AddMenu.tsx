import { Box, Button } from "@mui/material";
import { HabitType, HabitTypes } from "../utils/types";

type Props = {
	callback: (type: HabitType) => void;
};

const AddMenu: React.FC<Props> = ({ callback }) => {
	return (
		<Box className="flex-center col gap2" sx={{ "& > *": { width: "100%" } }}>
			<Button variant="outlined" onClick={() => callback(HabitTypes.GOOD)}>
				Good Habit
			</Button>
			<Button variant="outlined" onClick={() => callback(HabitTypes.BAD)}>
				Bad Habit
			</Button>
			<Button variant="outlined" onClick={() => callback(HabitTypes.COUNTER)}>
				Counter Habit
			</Button>
		</Box>
	);
};

export default AddMenu;
