import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import LoadingModal from "./features/loading/LoadingModal";

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
				<LoadingModal />
				<RouterProvider router={router} />
			</Box>
		</ThemeProvider>
	);
}

export default App;
