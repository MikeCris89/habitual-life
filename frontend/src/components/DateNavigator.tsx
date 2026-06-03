import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
// import { startOfDay } from "../utils/timeUtils";

interface DateNavigatorProps {
	selectedDate: string; // ISO string
	onChange: (date: string) => void;
}

const containerSx = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 1.5,
	width: "100%",
};

const DateNavigator = ({ selectedDate, onChange }: DateNavigatorProps) => {
	const selected = dayjs(selectedDate);
	const today = dayjs().startOf("day");
	// const today = startOfDay();
	const isToday = selected.isSame(today, "day");

	const handlePrev = () => {
		const prev = selected.subtract(1, "day");
		onChange(prev.toISOString());
	};

	const handleNext = () => {
		if (isToday) return;
		const next = selected.add(1, "day");
		onChange(next.toISOString());
	};

	const handleToday = () => {
		if (isToday) return;
		onChange(today.toISOString());
	};

	return (
		<Box sx={containerSx}>
			<div
				style={{ display: "flex", alignItems: "center", position: "relative" }}
			>
				<IconButton size="small" onClick={handlePrev}>
					<ChevronLeft fontSize="small" />
				</IconButton>
				<Typography variant="body2">{selected.format("ddd, MMM D")}</Typography>
				<IconButton size="small" onClick={handleNext} disabled={isToday}>
					<ChevronRight fontSize="small" />
				</IconButton>
				<IconButton
					// size="small"
					// variant="text"
					onClick={handleToday}
					disabled={isToday}
					sx={{
						position: "absolute",
						left: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						padding: 0,
						margin: 0,
						color: "primary.main",
					}}
				>
					<Today sx={{ height: "20px" }} />
				</IconButton>
			</div>
		</Box>
	);
};

export default DateNavigator;
