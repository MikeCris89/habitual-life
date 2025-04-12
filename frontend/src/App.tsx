import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import { Box } from "@mui/material";
import LoadingModal from "./features/loading/LoadingModal";
import { ThemeModeProvider } from "./hooks/ThemeProvider";

function App() {
	return (
		<ThemeModeProvider>
			<Box sx={{ height: "100%" }}>
				<LoadingModal />
				<RouterProvider router={router} />
			</Box>
		</ThemeModeProvider>
	);
}

export default App;
