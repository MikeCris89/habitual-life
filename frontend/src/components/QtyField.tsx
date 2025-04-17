import { AddCircle, Delete, RemoveCircle } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { CSSProperties } from "react";
import { FoodCategory } from "../utils/types";
import { useThemeMode } from "../hooks/ThemeProvider";

const inputStyle: CSSProperties = {
	border: "none",
	textAlign: "center",
	width: "30px",
	background: "transparent",
};

interface Props {
	value: number;
	onChange: (value: number, foodCat?: FoodCategory) => void;
	collapse?: boolean;
	deleteBtn?: boolean;
	max?: number;
	min?: number;
}

const QtyField = ({
	value,
	onChange,
	collapse = false,
	deleteBtn = false,
	max = 99,
	min = 0,
}: Props) => {
	const isCollapsed = collapse && value === 0;
	const { isLight, theme } = useThemeMode();

	const handleChange = (num: number) => {
		if (num < min) num = min;
		if (num > max) return;
		onChange(num);
	};

	return (
		<Box
			className="flex"
			sx={{
				justifyContent: "flex-end",
				width: "90px",
				border: "1px solid",
				borderColor: isCollapsed ? "rgba(0, 0, 0, 0)" : "lightgray",
				borderRadius: "12px",
				transition: "border-color 0.5s ease",
				overflow: "hidden",
				flexShrink: 0,
				position: "relative",
				background: "transparent",
			}}
		>
			<Box
				className="flex"
				sx={{
					position: "absolute",
					left: 0,
					top: 0,
					bottom: 0,
					transform: isCollapsed ? "translateX(100%)" : "translateX(0)",
					opacity: isCollapsed ? 0 : 1,
					transition: "transform 0.5s ease, opacity 0.5s ease",
					pointerEvents: isCollapsed ? "none" : "auto",
				}}
			>
				<IconButton size="small" onClick={() => handleChange(value - 1)}>
					{deleteBtn && value === 1 ? (
						<Delete fontSize="small" color="warning" />
					) : (
						<RemoveCircle fontSize="small" />
					)}
				</IconButton>
				<input
					type="number"
					inputMode="numeric"
					value={value}
					onChange={(e) => handleChange(+e.target.value)}
					style={{ ...inputStyle, color: theme.palette.text.primary }}
				/>
			</Box>
			<IconButton size="small" onClick={() => handleChange(value + 1)}>
				<AddCircle fontSize="small" />
			</IconButton>
		</Box>
	);
};

export default QtyField;
