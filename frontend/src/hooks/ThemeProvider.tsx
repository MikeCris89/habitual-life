import { createContext, useContext } from "react";
import { darkTheme, lightTheme } from "../utils/muiTheme";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { useGetMetaQuery, useSetThemeMutation } from "../features/meta/metaApi";

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
	const { data: metaData } = useGetMetaQuery();
	const [setTheme] = useSetThemeMutation();

	const mode = metaData?.theme ?? "light";

	const toggleTheme = () => {
		if (metaData) {
			setTheme({
				userId: metaData?.userId,
				theme: mode === "light" ? "dark" : "light",
			});
		}
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
