import { Box, Card, Typography } from "@mui/material";
import { DaysOfWeek, Habit } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { dayStyle, dayActive } from "../../utils/styles";

type CardProps = {
	habit: Habit;
};

type DaysProps = {
	days: DaysOfWeek;
};

export const Days: React.FC<DaysProps> = ({ days }) => {
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

const HabitCard: React.FC<CardProps> = ({ habit }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/habits/${habit.id}`);
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
			{/* <Typography
				variant="body1"
				sx={{ fontSize: "8px", p: 0, opacity: "0.6" }}
			>
				{habit.type[0].toUpperCase() + habit.type.slice(1)} Habit
			</Typography> */}
			<Typography variant="h6">{habit.title}</Typography>

			<Days days={habit.daysOfWeek} />
		</Card>
	);
};

export default HabitCard;
