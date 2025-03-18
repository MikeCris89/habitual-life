import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

interface Props {
	value: number; // Target number
	start: number;
	duration?: number; // Time for animation in milliseconds
}

const NumberAnimation = ({ value, duration = 800 }: Props) => {
	const [displayValue, setDisplayValue] = useState(value);
	// const [start, setStart] = useState(0);
	let start = 0;

	useEffect(() => {
		const increment = value / (duration / 20); // Adjust steps based on duration

		const counter = setInterval(() => {
			start += increment;
			if (start >= value) {
				setDisplayValue(value); // Ensure it stops exactly at the target
				start = value;
				clearInterval(counter);
			} else {
				setDisplayValue(Math.round(start)); // Round for whole numbers
			}
		}, 20); // Update every 20ms for a smooth effect

		return () => clearInterval(counter);
	}, [value, duration]);

	return <>{displayValue}</>;
};

export default NumberAnimation;
