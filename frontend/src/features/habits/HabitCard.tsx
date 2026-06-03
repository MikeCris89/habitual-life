import { Box, Card, Chip, Typography } from "@mui/material";
import { DaysOfWeek, Habit, HabitType, HabitTypes } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { dayStyle, dayActive } from "../../utils/styles";
import { useThemeMode } from "../../hooks/ThemeProvider";
import { displayTitle, formatLabel } from "../../utils/helpers";

interface CardProps {
	habit: Habit;
}

interface DaysProps {
	days: DaysOfWeek;
}

export const Days = ({ days }: DaysProps) => {
	const { theme } = useThemeMode();
	return (
		<Box className="flex gap1" sx={{ float: "right" }}>
			{days &&
				Object.values(days).map((day, i) => {
					return (
						<Typography
							variant="body2"
							sx={{
								...dayStyle,
								...(day.isTrue ? dayActive : {}),
								height: "10px",
								width: "10px",
								fontSize: "9px",
								border: `1px solid ${theme.palette.primary.main}`,
							}}
							key={`${day.label}${i}`}
						/>
					);
				})}
		</Box>
	);
};

export const HabitChip = ({ type }: { type: HabitType }) => {
	const color = () => {
		if (type === HabitTypes.GOOD) {
			return "success";
		}
		if (type === HabitTypes.BAD) {
			return "error";
		}
		if (type === HabitTypes.COUNTER) {
			return "warning";
		}
		return "default";
	};
	return (
		<Chip
			label={`${formatLabel(type)} Habit`}
			size="small"
			variant="outlined"
			color={color()}
		/>
	);
};

const HabitCard = ({ habit }: CardProps) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/${habit.id}`);
	};

	return (
		<Card
			elevation={3}
			sx={{
				padding: 1,
				width: "100%",
				height: "100%",
				overflowWrap: "break-word",
			}}
			onClick={handleClick}
		>
			<Typography variant="h6">{displayTitle(habit)}</Typography>

			<Box className="flex-between full-w">
				<HabitChip type={habit.type} />
				<Days days={habit.daysOfWeek} />
			</Box>
		</Card>
	);
};

export default HabitCard;
