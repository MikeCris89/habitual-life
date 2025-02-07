import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Box } from "@mui/material";
import useDisplay from "../hooks/useDisplay";
import { useSelector } from "react-redux";
import { RootState } from "../features/legacy/thunksStore";

const Root = () => {
	const { isMobile } = useDisplay();
	const habits = useSelector((state: RootState) => state.habits);

	if (!habits) <h2>Habits Error.</h2>;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: isMobile ? "column-reverse" : "column",
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<NavBar isMobile={isMobile} />

			<Box
				sx={{
					width: "100%",
					height: "100%",
					padding: "5px 10px",
					overflow: "hidden",
					flex: 1,
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Root;
