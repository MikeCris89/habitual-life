import { SxProps, TextField, Theme } from "@mui/material";
import { stringToNum } from "../utils/helpers";
import { useEffect, useRef, useState } from "react";

interface Props {
	value: number;
	onChange: (value: number) => void;
	label?: string;
	min?: number;
	max?: number;
	maxLength?: number;
	acceptDecimals?: boolean;
	textAlign?: "left" | "center" | "right";
	disabled?: boolean;
	fullWidth?: boolean;
	sx?: SxProps<Theme>;
	autoComplete?: boolean;
	required?: boolean;
	size?: "small" | "medium";
	error?: boolean;
	variant?: "standard" | "filled" | "outlined";
	onBlur?: (value: string) => void;
	delayChange?: boolean;
	fontSize?: string;
}

const NumberInput = ({
	value,
	onChange,
	label = "",
	min = 0,
	max,
	maxLength = 10,
	acceptDecimals = false,
	textAlign = "left",
	disabled = false,
	fullWidth = true,
	sx = {},
	autoComplete = false,
	required = true,
	size = "medium",
	error = false,
	variant = "outlined",
	onBlur,
	delayChange = false,
	fontSize = "16px",
}: Props) => {
	const [strValue, setStrValue] = useState<string>(value.toString() || "0");
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (strValue !== value.toString()) {
			const endsInDecimal = strValue.endsWith(".");
			setStrValue(endsInDecimal ? value.toString() + "." : value.toString());
		}
	}, [value]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const getNum = (value: string) => {
		const num = stringToNum(value);
		if (num < min) return;
		if (max && num > max) return;
		return num;
	};

	const handleInput = (inputValue: string, skipDelay = false) => {
		let endsInDecimal = false;
		if (acceptDecimals) {
			endsInDecimal =
				inputValue.endsWith(".") && inputValue.split(".").length < 3;
			const hasDecimal = inputValue.includes(".");
			if (hasDecimal && inputValue.split(".")[1].length > 2) return;
			if (inputValue === ".") inputValue = "0.";
		}
		const num = getNum(inputValue);
		if (num != null && !isNaN(num)) {
			let numString = num.toString();

			if (acceptDecimals) {
				numString = endsInDecimal
					? numString + "."
					: inputValue.endsWith(".0")
					? numString + ".0"
					: numString;
			}

			setStrValue(numString);
			if (delayChange) {
				if (!skipDelay) {
					if (timeoutRef.current) clearTimeout(timeoutRef.current);
					const timeout = setTimeout(() => {
						onChange(num);
						timeoutRef.current = null;
					}, 800);
					timeoutRef.current = timeout;
				} else if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
					onChange(num);
				}
			} else {
				onChange(num);
			}
		}
	};

	return (
		<TextField
			error={error}
			helperText={error ? "Incorrect entry" : ""}
			variant={variant}
			type="text"
			label={label}
			value={strValue}
			onChange={(e) => handleInput(e.target.value)}
			slotProps={{
				input: {
					inputProps: {
						//maxLength: strValue.includes(".") ? maxLength + 2 : maxLength + 1,
						inputMode: "numeric",
					},
				},
			}}
			disabled={disabled}
			fullWidth={fullWidth}
			sx={{
				...sx,
				"& .MuiInputBase-input": {
					textAlign: textAlign,
					fontSize: fontSize,
				},
				p: 0,
			}}
			autoComplete={autoComplete ? "" : "off"}
			required={required}
			size={size}
			onFocus={(e) => {
				if (e.target.value === "0") setStrValue("");
			}}
			onBlur={(e) => {
				if (e.target.value === "") setStrValue("0");
				if (delayChange) handleInput(e.target.value, true);
				if (strValue.endsWith(".")) setStrValue((prev) => prev.slice(0, -1));
				if (strValue.endsWith(".0") || strValue.endsWith(".00"))
					setStrValue((prev) => prev.split(".")[0]);
				// if (strValue.includes(".") && strValue.split(".")[1].length < 2)
				// 	setStrValue((prev) => prev + "0");
				//if (onBlur) onBlur(e.target.value);
			}}
		/>
	);
};

export default NumberInput;
