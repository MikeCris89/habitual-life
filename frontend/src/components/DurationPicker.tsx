import { Box, Button, IconButton, Typography } from "@mui/material";
import { useRef } from "react";

interface Props {
	handleChange: (msDuration: number) => void;
	value: number;
}

const numberInputStyle: React.CSSProperties = {
	width: "2ch",
	textAlign: "center",
	border: "none",
	fontSize: "inherit",
	outline: "none",
	fontWeight: "bold",
	background: "transparent",
};

const minInputStyle: React.CSSProperties = {
	...numberInputStyle,
	gridColumn: "1",
	gridRow: "2",
};

const secInputStyle: React.CSSProperties = {
	...numberInputStyle,
	gridColumn: "3",
	gridRow: "2",
};

const formatNum = (num: number): string => {
	const stringNum = num.toString();
	return stringNum.length < 2 ? stringNum.padStart(2, "0") : stringNum;
};

const initMinutes = (value: number): string => {
	const minutes = Math.floor(value / 1000 / 60);
	return formatNum(minutes);
};

const initSeconds = (value: number): string => {
	const seconds = (value / 1000) % 60;
	return formatNum(seconds);
};

const DurationPicker = ({ handleChange, value = 0 }: Props) => {
	const minutesRef = useRef<HTMLInputElement | null>(null);
	const secondsRef = useRef<HTMLInputElement | null>(null);

	const minutes = initMinutes(value);
	const seconds = initSeconds(value);

	const handleDuration = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "hours" | "minutes" | "seconds"
	) => {
		let value = e.target.value.replace(/\D/g, "");
		if (value.length > 2) {
			value.startsWith("59")
				? (value = value.slice(-1))
				: (value = value.slice(-2));
		}
		let num = Number(value);
		num = Math.max(0, Math.min(59, num));

		let currentDur: number = 0;

		if (type === "minutes") {
			currentDur = num * 60 * 1000 + Number(seconds) * 1000;
		}

		if (type === "seconds") {
			currentDur = Number(minutes) * 60 * 1000 + num * 1000;
		}

		handleChange(currentDur);
	};

	// Move cursor to end of number input onClick
	const handleClickFocus = (e: React.MouseEvent<HTMLInputElement>) => {
		const input = e.currentTarget as HTMLInputElement;
		setTimeout(() => {
			input.setSelectionRange(input.value.length, input.value.length);
		}, 0);
	};
	return (
		<Box className="flex-center gap2" sx={{ justifyContent: "end" }}>
			<Box
				sx={{
					display: "grid",
					gridTemplate: "auto auto / 1fr auto 1fr",
					alignItems: "center",
					justifyItems: "center",
					padding: "6px 16px",
					borderRadius: "8px",
					border: "1px solid #ccc",
					width: "fit-content",
					backgroundColor: "#fff",
					fontSize: "1.2rem",
					fontFamily: "Arial, sans-serif",
					boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.2)",
				}}
			>
				{/* Minutes Label */}
				<Typography
					variant="caption"
					sx={{
						gridColumn: "1",
						gridRow: "1",
						color: "rgba(0, 0, 0, 0.5)",
						fontWeight: "bold",
						fontSize: "0.6rem",
						letterSpacing: "0.5px",
					}}
				>
					MIN
				</Typography>

				{/* Minutes Input */}
				<input
					type="text"
					inputMode="numeric"
					value={minutes}
					ref={minutesRef}
					onChange={(e) => handleDuration(e, "minutes")}
					onClick={handleClickFocus}
					placeholder="00"
					maxLength={3}
					style={minInputStyle}
				/>

				{/* Colon Separator */}
				<Typography
					sx={{
						gridColumn: "2",
						gridRow: "2",
						fontSize: "1.2rem",
						fontWeight: "bold",
						margin: "0 4px",
						maxHeight: "100%",
						alignSelf: "center",
						justifySelf: "center",
					}}
				>
					:
				</Typography>

				{/* Seconds Label */}
				<Typography
					variant="caption"
					sx={{
						gridColumn: "3",
						gridRow: "1",
						color: "rgba(0, 0, 0, 0.5)",
						fontWeight: "bold",
						fontSize: "0.6rem",
						letterSpacing: "0.5px",
						textAlign: "center",
					}}
				>
					SEC
				</Typography>

				{/* Seconds Input */}
				<input
					type="text"
					inputMode="numeric"
					value={seconds}
					ref={secondsRef}
					onChange={(e) => handleDuration(e, "seconds")}
					onClick={handleClickFocus}
					placeholder="00"
					maxLength={3}
					style={secInputStyle}
				/>
			</Box>
			<IconButton
				size="small"
				onClick={() => {
					if (value !== 0) handleChange(0);
				}}
				sx={{ fontSize: "14px", maxWidth: "20px", fontWeight: "bold", p: 0 }}
			>
				{value !== 0 && "X"}
			</IconButton>
		</Box>
	);
};

export default DurationPicker;
