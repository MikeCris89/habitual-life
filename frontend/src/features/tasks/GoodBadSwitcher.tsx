import { Box, Button, Paper } from "@mui/material";
import { useState } from "react";
import GoodTasksToday from "./GoodTasksToday";
import BadTasksToday from "./BadTasksToday";
import AddButton from "../../components/AddButton";
import DateNavigator from "../../components/DateNavigator";
import { startOfDay } from "../../utils/timeUtils";

const GoodBadSwitcher = () => {
	const [tab, setTab] = useState(false);
	const [selectedDate, setSelectedDate] = useState<string>(startOfDay());

	return (
		<>
			<DateNavigator
				selectedDate={selectedDate}
				onChange={(date) => setSelectedDate(date)}
			/>
			<Box
				sx={{
					px: 1,
					py: 0.5,
					display: "grid",
					gridTemplateColumns: "1fr 4fr 1fr",
					width: "100%",
					alignItems: "center",
				}}
			>
				<div></div>
				<Box className="flex-center">
					<Button
						size="small"
						variant={tab ? "outlined" : "contained"}
						onClick={() => setTab(false)}
						sx={{ borderRadius: "8px 0 0 8px" }}
					>
						To-Do
					</Button>
					<Button
						size="small"
						variant={tab ? "contained" : "outlined"}
						onClick={() => setTab(true)}
						sx={{ borderRadius: "0 8px 8px 0" }}
					>
						Not To-Do
					</Button>
				</Box>
				<AddButton />
			</Box>
			<Paper
				elevation={3}
				sx={{
					width: "100%",
					minHeight: 0,
					flex: 1,
					overflowY: "hidden",
					p: 1,
					borderRadius: "12px",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
				}}
			>
				{!tab ? (
					<GoodTasksToday selectedDate={selectedDate} />
				) : (
					<BadTasksToday selectedDate={selectedDate} />
				)}
			</Paper>
		</>
	);
};

export default GoodBadSwitcher;
