import { RemoveOutlined } from "@mui/icons-material";
import { Button, ButtonGroup, lighten, useTheme } from "@mui/material";
import { useState } from "react";
import NumberInput from "./NumberInput";

interface Props {
	max?: number;
	min?: number;
	step?: number;
	value?: number;
	acceptDecimals?: boolean;
	handleChange: (num: number) => void;
}

const NumberField = ({
	max = 99,
	min = 0,
	step = 1,
	value = 0,
	acceptDecimals = false,
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
				maxHeight: "32px",
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
			{/* <input
				type="text"
				inputMode="numeric"
				value={value.toString()}
				onChange={(e) => handleInputChange(e.target.value)}
				style={{
					width: "6ch",
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
			/> */}
			<NumberInput
				value={value}
				onChange={(value) => handleChange(value)}
				variant="standard"
				min={min}
				max={max}
				//maxLength={5}
				textAlign="center"
				acceptDecimals={acceptDecimals}
				sx={{
					//border: focused ? `3px solid ${focusColor}` : "none",
					fontSize: "1rem",
					background: "transparent",
					//fontWeight: "bold",
					borderRadius: 0,
					// outline: "none",
					//minHeight: "32px",
					//textAlign: "center",
					//margin: "0 5px",
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
