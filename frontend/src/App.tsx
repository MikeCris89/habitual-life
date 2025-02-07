import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setData, setTasks } from "./utils/storageHandler";
import { selectHabits, selectTasks } from "./features/legacy/oldSelectors";

function App() {
	const theme = createTheme({
		palette: {
			background: {
				default: "#f5f5f5", // Light grey background
			},
		},
	});

	const habits = useSelector(selectHabits);
	const tasks = useSelector(selectTasks);

	useEffect(() => {
		console.log("Updating Storage", habits, tasks);

		setData("habits", habits);
		setTasks(tasks);
	}, [habits, tasks]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ height: "100%" }}>
				<RouterProvider router={router} />
			</Box>
		</ThemeProvider>
	);
}

export default App;
