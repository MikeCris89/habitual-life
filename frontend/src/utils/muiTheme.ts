import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
	palette: {
		mode: "light",
		background: {
			default: "#f5f5f5",
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: "#f5f5f5",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: "#fafafa",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundColor: "#fff",
					borderRadius: 12,
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#ffffff",
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundColor: "#fafafa",
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: "#e0e0e0",
				},
			},
		},
	},
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: "#121212",
			paper: "#1e1e1e",
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: "#121212",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: "#1e1e1e",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundColor: "#2a2a2a",
					borderRadius: 12,
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#181818",
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundColor: "#1c1c1c",
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: "#2d2d2d",
				},
			},
		},
	},
});
