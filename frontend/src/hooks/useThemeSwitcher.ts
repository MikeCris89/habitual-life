import { useTheme } from "@mui/material";

const useThemeSwitcher = () => {
	const theme = useTheme();
	console.log(theme.palette.mode);
	const isLight = theme.palette.mode === "light";
	return { isLight, palette: theme.palette };
};

export default useThemeSwitcher;
