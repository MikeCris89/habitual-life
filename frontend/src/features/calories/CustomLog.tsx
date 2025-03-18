import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import NumberInput from "../../components/NumberInput";
import { useEffect, useRef, useState } from "react";
import { MacroState, setCalories, setMacros } from "./CaloriesSlice";
import { MacrosType } from "../../utils/types";
import { useDispatch } from "react-redux";

interface Props {
	calories: number;
	macros: MacroState[];
	// delayChange?: boolean;
	// handleChangeCalories: (value: number) => void;
	// handleCalorieDisplay: () => void;
	// handleChangeMacros: (value: number, id: string) => void;
	// handleMacroDisplay: (id: string) => void;
}

const CustomLog = ({
	calories,
	macros,
}: //delayChange = false,
// handleChangeCalories,
// handleChangeMacros,
// handleCalorieDisplay,
// handleMacroDisplay,
Props) => {
	const dispatch = useDispatch();
	const [cal, setCal] = useState(calories ?? 0);
	const [mac, setMac] = useState<MacroState[]>([
		...macros.map((el) => ({ ...el })),
	]);

	// const calTimerRef = useRef<NodeJS.Timeout | null>(null);
	// const macTimerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		console.log("custom log useEffect");
		setCal(calories);
		setMac((prev) => {
			return [
				...macros.map((el) => {
					const prevAmount = prev.find((p) => p.id === el.id)?.amount;
					return { ...el, amount: prevAmount || 0 };
				}),
			];
		});
	}, [calories, macros]);

	// useEffect(() => {
	// 	return () => {
	// 		if (calTimerRef.current) clearTimeout(calTimerRef.current);
	// 	};
	// }, []);

	const handleChangeCal = (value: number, skipDelay = false) => {
		setCal(value);
		dispatch(setCalories(value));

		// if (calTimerRef.current) clearTimeout(calTimerRef.current);
		// if (calories !== value) {
		// 	if (delayChange && !skipDelay) {
		// 		const newTimer = setTimeout(() => {
		// 			dispatch(setCalories(value));
		// 			calTimerRef.current = null;
		// 		}, 800);
		// 		calTimerRef.current = newTimer;
		// 	} else {
		// dispatch(setCalories(value));
		// 	}
		// }
	};

	const handleChangeMac = (value: number, id: string, skipDelay = false) => {
		setMac((prev) =>
			prev.map((el) => (el.id === id ? { ...el, amount: value } : el))
		);

		dispatch(setMacros({ value, id }));

		// if (macTimerRef.current) clearTimeout(macTimerRef.current);

		// if (delayChange && !skipDelay) {
		// 	const timer = setTimeout(() => dispatch(setMacros({ value, id })), 800);
		// 	macTimerRef.current = timer;
		// } else {
		// 	dispatch(setMacros({ value, id }));
		// }
	};

	return (
		<Paper sx={{ p: 1, height: "100%", minHeight: 0, overflow: "auto" }}>
			<NumberInput
				label="Calories"
				value={calories}
				onChange={(value) => handleChangeCal(value)}
				fullWidth={false}
				sx={{ float: "right" }}
				maxLength={4}
				size="small"
				required={false}
				delayChange={true}
				// onBlur={(value) => {
				// 	// if (calTimerRef.current) clearTimeout(calTimerRef.current);
				// 	handleChangeCal(value, true);
				// }}
			/>
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: "bold" }}>Macros</TableCell>
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{macros.map((macro) => (
							<TableRow key={macro.id}>
								<TableCell component="th" scope="row">
									{macro.title} {`(${macro.units})`}
								</TableCell>
								<TableCell align="right">
									<NumberInput
										value={macro.amount}
										onChange={(value) => handleChangeMac(value, macro.id)}
										size="small"
										fullWidth={false}
										maxLength={4}
										sx={{ width: "75px" }}
										required={false}
										delayChange={true}
										//onBlur={(value) => handleChangeMac(value, macro.id, true)}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default CustomLog;
