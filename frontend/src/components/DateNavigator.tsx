import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
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
				<Button
					size="small"
					variant="text"
					onClick={handleToday}
					disabled={isToday}
					sx={{
						ml: 1,
						position: "absolute",
						left: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					Today
				</Button>
			</div>
		</Box>
	);
};

export default DateNavigator;
