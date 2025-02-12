import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";

function App() {
	const theme = createTheme({
		palette: {
			background: {
				default: "#f5f5f5", // Light grey background
			},
		},
	});

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
