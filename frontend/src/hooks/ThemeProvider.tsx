import { createContext, useContext, useState } from "react";
import { darkTheme, lightTheme } from "../utils/muiTheme";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";

const ThemeContext = createContext({
	mode: "light",
	toggleTheme: () => {},
	isLight: true,
	theme: lightTheme,
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeModeProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [mode, setMode] = useState("light");

	const toggleTheme = () => {
		setMode((prev) => (prev === "light" ? "dark" : "light"));
	};

	const theme = mode === "light" ? lightTheme : darkTheme;

	return (
		<ThemeContext.Provider
			value={{ mode, toggleTheme, isLight: mode === "light", theme }}
		>
			<MUIThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</ThemeContext.Provider>
	);
};
