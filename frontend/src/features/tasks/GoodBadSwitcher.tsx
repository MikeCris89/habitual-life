import { Box, Button } from "@mui/material";
import { useState } from "react";
import GoodTasksToday from "./GoodTasksToday";
import BadTasksToday from "./BadTasksToday";
import AddButton from "../../components/AddButton";

const GoodBadSwitcher = () => {
	const [tab, setTab] = useState(false);
	console.log("GoodBadSwitcher Rendering ");

	return (
		<>
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
						Today
					</Button>
					<Button
						size="small"
						variant={tab ? "contained" : "outlined"}
						onClick={() => setTab(true)}
					>
						No-No List
					</Button>
				</Box>
				<AddButton />
			</Box>
			<Box
				sx={{
					width: "100%",
					minHeight: 0,
					overflowY: "auto",
					height: "100%",
					//bgcolor: "grey.200",
					borderRadius: "12px",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
				}}
			>
				{!tab ? <GoodTasksToday /> : <BadTasksToday />}
			</Box>
		</>
	);
};

export default GoodBadSwitcher;
