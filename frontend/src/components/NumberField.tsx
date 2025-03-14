import { RemoveOutlined } from "@mui/icons-material";
import { Button, ButtonGroup, lighten, useTheme } from "@mui/material";
import { useState } from "react";

interface Props {
	max?: number;
	min?: number;
	step?: number;
	value?: number;
	handleChange: (num: number) => void;
}

const NumberField = ({
	max = 99,
	min = 0,
	step = 1,
	value = 0,
	handleChange,
}: Props) => {
	const [focused, setFocused] = useState<boolean>(false);
	const theme = useTheme();

	const lightBorder = lighten(`${theme.palette.primary.main}`, 0.5);
	const focusColor = lighten(theme.palette.primary.main, 0.8);

	const handleInputChange = (val: string) => {
		let num = Number(val.replace(/\D/g, ""));
		if (isNaN(num)) num = min;
		if (num >= min && num <= max) handleChange(num);
	};

	return (
		<ButtonGroup
			size="small"
			variant="contained"
			color={"inherit"}
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "end",
				maxWidth: "140px",
				color: `${lightBorder}`,
			}}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
		>
			{/* Minus Button */}
			<Button
				sx={{
					maxWidth: "32px",
					minHeight: "32px",
					padding: "4px",
					//borderRight: "none",
					fontWeight: "bold",
				}}
				onClick={() => handleChange(Math.max(value - step, min))}
			>
				-
			</Button>

			{/* Number Input */}
			<input
				type="text"
				inputMode="numeric"
				value={value.toString()}
				onChange={(e) => handleInputChange(e.target.value)}
				style={{
					//width: "5ch",
					height: "32px",
					//minHeight: "32px",
					textAlign: "center",
					//border: "none",
					border: focused ? `3px solid ${focusColor}` : "none",

					fontSize: "1rem",
					outline: "none",
					background: "transparent",
					fontWeight: "bold",
					borderRadius: 0,
				}}
			/>

			{/* Plus Button */}
			<Button
				sx={{
					maxWidth: "32px",
					minHeight: "32px",
					padding: "4px",
					//borderLeft: "none",
					fontWeight: "bold",
				}}
				onClick={() => handleChange(Math.min(value + step, max))}
			>
				+
			</Button>
		</ButtonGroup>
	);
};

export default NumberField;
