import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import { Box } from "@mui/material";
import LoadingModal from "./features/loading/LoadingModal";
import { ThemeModeProvider } from "./hooks/ThemeProvider";
import { DialogProvider } from "./features/modal/DialogModal";

function App() {
	return (
		<ThemeModeProvider>
			<DialogProvider>
				<Box sx={{ height: "100%" }}>
					<LoadingModal />
					<RouterProvider router={router} />
				</Box>
			</DialogProvider>
		</ThemeModeProvider>
	);
}

export default App;
