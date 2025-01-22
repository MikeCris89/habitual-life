Material-UI (MUI) provides a theme object with predefined color options that you can use to style your components. These colors are part of the palette and are defined in the theme’s palette object. Here’s a quick guide to the most commonly used color options:

Primary Colors
• primary.main: The main color for your primary theme (e.g., the primary button or main app bar color).
• primary.light: A lighter shade of the primary color.
• primary.dark: A darker shade of the primary color.
• primary.contrastText: The color for text on primary-colored backgrounds (usually white or black).

Secondary Colors
• secondary.main: The main color for your secondary theme (e.g., accents or secondary actions).
• secondary.light: A lighter shade of the secondary color.
• secondary.dark: A darker shade of the secondary color.
• secondary.contrastText: The color for text on secondary-colored backgrounds.

Error Colors
• error.main: The main color for error states.
• error.light: A lighter shade of the error color.
• error.dark: A darker shade of the error color.
• error.contrastText: The color for text on error-colored backgrounds.

Warning Colors
• warning.main: The main color for warning states.
• warning.light: A lighter shade of the warning color.
• warning.dark: A darker shade of the warning color.
• warning.contrastText: The color for text on warning-colored backgrounds.

Info Colors
• info.main: The main color for informational messages.
• info.light: A lighter shade of the info color.
• info.dark: A darker shade of the info color.
• info.contrastText: The color for text on info-colored backgrounds.

Success Colors
• success.main: The main color for success states.
• success.light: A lighter shade of the success color.
• success.dark: A darker shade of the success color.
• success.contrastText: The color for text on success-colored backgrounds.

Text Colors
• text.primary: The main text color (usually black or a dark gray).
• text.secondary: A secondary text color (usually lighter than text.primary).
• text.disabled: The color for disabled text.

Background Colors
• background.default: The default background color for your app (typically white or light gray).
• background.paper: The background color for surfaces like cards or modals.

Divider Color
• divider: The color for dividers and borders (usually a light gray).

Example of Using Colors

Here’s how you can use these colors in your components:

```js
import { Box } from "@mui/material";

export default function Example() {
	return (
		<Box
			sx={{
				backgroundColor: "primary.main",
				color: "primary.contrastText",
				padding: 2,
				textAlign: "center",
			}}
		>
			This is a box with the primary color!
		</Box>
	);
}
```

How to View or Customize Colors

You can check or customize these colors in your theme. To see the default values:

import { createTheme } from "@mui/material/styles";

const theme = createTheme();
console.log(theme.palette);

To customize the colors, use createTheme:

```js
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1976d2", // Custom primary color
			light: "#63a4ff",
			dark: "#004ba0",
			contrastText: "#fff",
		},
		secondary: {
			main: "#9c27b0",
		},
	},
});
```

This flexibility lets you tailor your app’s design to match your branding needs! 😊
