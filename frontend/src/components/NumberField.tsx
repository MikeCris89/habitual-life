import { Button, ButtonGroup, lighten, useTheme } from "@mui/material";
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
	const theme = useTheme();

	const lightBorder = lighten(`${theme.palette.primary.main}`, 0.5);

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
		>
			<Button
				sx={{
					maxWidth: "32px",
					minHeight: "32px",
					padding: "4px",
					fontWeight: "bold",
				}}
				onClick={() => handleChange(Math.max(value - step, min))}
			>
				-
			</Button>
			<NumberInput
				value={value}
				onChange={(value) => handleChange(value)}
				variant="standard"
				min={min}
				max={max}
				textAlign="center"
				acceptDecimals={acceptDecimals}
				sx={{
					fontSize: "1rem",
					background: "transparent",
					borderRadius: 0,
				}}
			/>
			<Button
				sx={{
					maxWidth: "32px",
					minHeight: "32px",
					padding: "4px",
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
