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

	console.log("GoodBadSwitcher Rendering ", { tab, selectedDate });

	return (
		<>
			<DateNavigator
				selectedDate={selectedDate}
				onChange={(date) => setSelectedDate(date)}
			/>
			<Box
				sx={{
					p: 1,
					display: "grid",
					gridTemplateColumns: "1fr 4fr 1fr",
					width: "100%",
				}}
			>
				<div></div>
				<Box className="flex-center">
					<Button
						size="small"
						variant={tab ? "outlined" : "contained"}
						onClick={() => setTab(false)}
					>
						To-Do
					</Button>
					<Button
						size="small"
						variant={tab ? "contained" : "outlined"}
						onClick={() => setTab(true)}
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
					overflowY: "hidden",
					height: "100%",
					p: 1,
					//bgcolor: "grey.200",
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
