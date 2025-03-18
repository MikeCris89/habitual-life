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
}

const NumberInput = ({
	value,
	onChange,
	label = "",
	min = 0,
	max,
	maxLength = 10,
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
}: Props) => {
	const [strValue, setStrValue] = useState<string>(value.toString() || "0");
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (strValue !== value.toString()) {
			setStrValue(value.toString());
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
		if (max && num > max) return max;
		return num;
	};

	const handleInput = (value: string, skipDelay = false) => {
		const num = getNum(value);
		if (num != null) {
			setStrValue(num.toString());
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
					inputProps: { maxLength, inputMode: "numeric" },
				},
			}}
			disabled={disabled}
			fullWidth={fullWidth}
			sx={sx}
			autoComplete={autoComplete ? "" : "off"}
			required={required}
			size={size}
			onFocus={(e) => {
				if (e.target.value === "0") setStrValue("");
			}}
			onBlur={(e) => {
				if (e.target.value === "") setStrValue("0");
				handleInput(e.target.value, true);

				//if (onBlur) onBlur(e.target.value);
			}}
		/>
	);
};

export default NumberInput;
