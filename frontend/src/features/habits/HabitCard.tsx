import { Box, Card, Typography } from "@mui/material";
import { DaysOfWeek, Habit } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { dayStyle, dayActive } from "../../utils/styles";

interface CardProps {
	habit: Habit;
}

interface DaysProps {
	days: DaysOfWeek;
}

export const Days = ({ days }: DaysProps) => {
	return (
		<Box className="flex gap1" style={{ float: "right" }}>
			{days &&
				Object.values(days).map((day, i) => {
					return (
						<Typography
							variant="body2"
							sx={{
								...dayStyle,
								...(day.isTrue ? dayActive : {}),
								height: "20px",
								width: "20px",
								fontSize: "9px",
							}}
							key={`${day.label}${i}`}
						>
							{day.label}
						</Typography>
					);
				})}
		</Box>
	);
};

const HabitCard = ({ habit }: CardProps) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/${habit.id}`);
	};

	return (
		<Card
			sx={{
				padding: 1,
				width: "100%",
				height: "100%",
				overflowWrap: "break-word",
			}}
			onClick={handleClick}
		>
			<Typography variant="h6">{habit.title}</Typography>

			<Days days={habit.daysOfWeek} />
		</Card>
	);
};

export default HabitCard;
