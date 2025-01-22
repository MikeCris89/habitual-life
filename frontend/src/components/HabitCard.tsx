import { Box, Card, Typography } from "@mui/material";
import { DaysOfWeek, Habit } from "../utils/types";
import { useNavigate } from "react-router-dom";
import { dayStyle, dayActive } from "../utils/styles";

type CardProps = {
	habit: Habit;
};

type DaysProps = {
	days: DaysOfWeek;
};

export const Days: React.FC<DaysProps> = ({ days }) => {
	return (
		<Box className="flex gap2">
			{days &&
				Object.values(days).map((day, i) => {
					return (
						<Typography
							variant="body2"
							sx={{ ...dayStyle, ...(day.isTrue ? dayActive : {}) }}
							key={`${day.label}${i}`}
						>
							{day.label}
						</Typography>
					);
				})}
		</Box>
	);
};

const HabitCard: React.FC<CardProps> = ({ habit }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/habits/${habit.id}`);
	};

	return (
		<Card
			sx={{
				padding: 2,
				width: "100%",
				height: "100%",
				overflowWrap: "break-word",
			}}
			onClick={handleClick}
		>
			<Typography variant="h6">{habit.title}</Typography>
			<Typography variant="body1">Per Day:</Typography>
			<Box className="flex gap2">
				<Typography variant="body1">Days:</Typography>
				<Days days={habit.daysOfWeek} />
			</Box>
		</Card>
	);
};

export default HabitCard;
