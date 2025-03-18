import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
	count: number;
	total: number;
	units?: string;
	addAmount?: number;
}

const SemiCircleBar = ({ count, total, units, addAmount = 0 }: Props) => {
	const [addCounter, setAddCounter] = useState(0);

	useEffect(() => {
		setAddCounter(count + addAmount);
	}, [count, addAmount, setAddCounter]);

	const radius = 50;
	const circumference = Math.PI * radius;
	const progress = Math.min((count / total) * circumference, circumference);
	const amountProgress = Math.min(
		(addCounter / total) * circumference,
		circumference
	);
	const inLimits = count <= total;
	const addInLimits = addCounter <= total;

	return (
		<Box sx={{ position: "relative", width: "100%", height: "75px" }}>
			<svg width="60" height="60" viewBox="0 0 120 60">
				{/* Background Circle */}
				<path
					d="M 10 50 A 40 40 0 0 1 110 50"
					fill="none"
					stroke="#ddd"
					strokeWidth="8"
				/>

				{/* addAmount Arc */}
				<path
					d="M 10 50 A 40 40 0 0 1 110 50"
					fill="none"
					stroke={addInLimits ? "orange" : "red"}
					strokeWidth="8"
					strokeDasharray={circumference}
					strokeDashoffset={circumference - amountProgress}
					style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
				/>

				{/* Progress Arc */}
				<path
					d="M 10 50 A 40 40 0 0 1 110 50"
					fill="none"
					stroke={inLimits && addInLimits ? "green" : "red"}
					strokeWidth="8"
					strokeDasharray={circumference}
					strokeDashoffset={circumference - progress}
					style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
				/>
			</svg>

			{/* Centered Text */}
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "43px",
				}}
			>
				<Typography
					variant="body2"
					sx={{ fontSize: "12px", color: addAmount ? "green" : "black" }}
				>
					{addCounter}
				</Typography>
				<Typography
					variant="body2"
					style={{
						fontSize: "10px",
						borderTop: "1px solid lightgray",
						width: "100%",
					}}
				>
					/{total}
					{units}
				</Typography>
			</Box>
		</Box>
	);
};

export default SemiCircleBar;
