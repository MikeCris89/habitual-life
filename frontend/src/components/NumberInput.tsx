import { SxProps, TextField, Theme } from "@mui/material";
import { stringToNum } from "../utils/helpers";
import { useEffect, useState } from "react";

interface Props {
	value: number;
	onChange: (value: number) => void;
	label: string;
	min?: number;
	max?: number;
	maxLength?: number;
	disabled?: boolean;
	fullWidth?: boolean;
	sx?: SxProps<Theme>;
	autoComplete?: boolean;
	required?: boolean;
	size?: "small" | "medium";
}

const NumberInput = ({
	value,
	onChange,
	label,
	min = 0,
	max,
	maxLength = 10,
	disabled = false,
	fullWidth = true,
	sx = {},
	autoComplete = false,
	required = true,
	size = "medium",
}: Props) => {
	const [strValue, setStrValue] = useState<string>(value.toString());

	useEffect(() => {
		setStrValue(value.toString());
	}, [value]);

	const handleInput = (value: string) => {
		const num = stringToNum(value);
		if (num < min) return;
		if (max && num > max) return;
		onChange(num);
	};

	return (
		<TextField
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
			autoComplete={autoComplete.toString()}
			required={required}
			size={size}
			onFocus={(e) => {
				if (e.target.value === "0") setStrValue("");
			}}
			onBlur={(e) => {
				if (e.target.value === "") setStrValue("0");
			}}
		/>
	);
};

export default NumberInput;
