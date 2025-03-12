import {
	Box,
	Button,
	FormControl,
	FormLabel,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import PageNav from "../../components/PageNav";
import { useState } from "react";
import { CounterType, HabitType, HabitTypes } from "../../utils/types";
import { Add, Remove } from "@mui/icons-material";
import { stringToNum } from "../../utils/helpers";

interface CalorieType {
	id: string;
	title: string;
	type: HabitType;
	daysOfWeek: {
		Sunday: { isTrue: true; label: "S" };
		Monday: { isTrue: true; label: "M" };
		Tuesday: { isTrue: true; label: "T" };
		Wednesday: { isTrue: true; label: "W" };
		Thursday: { isTrue: true; label: "T" };
		Friday: { isTrue: true; label: "F" };
		Saturday: { isTrue: true; label: "S" };
	};
	createdAt: string;
	isMax: boolean;
	total: number;
	macros: MacrosForm[];
}

interface MacrosForm {
	title: string;
	total: string;
	units: string;
	id: number;
}

const initForm: CalorieType = {
	id: "preset_calories",
	title: "Calorie Counting",
	type: HabitTypes.COUNTER,
	daysOfWeek: {
		Sunday: { isTrue: true, label: "S" },
		Monday: { isTrue: true, label: "M" },
		Tuesday: { isTrue: true, label: "T" },
		Wednesday: { isTrue: true, label: "W" },
		Thursday: { isTrue: true, label: "T" },
		Friday: { isTrue: true, label: "F" },
		Saturday: { isTrue: true, label: "S" },
	},
	createdAt: new Date().toISOString(),
	isMax: true,
	total: 0,
	macros: [],
	// macros: [
	// 	{ title: "protein", max: 0, units: "g", id: 1 },
	// 	{ title: "carbs", max: 0, units: "g", id: 2 },
	// 	{ title: "fat", max: 0, units: "g", id: 3 },
	// ],
};

const presetMacros: MacrosForm[] = [
	{ title: "protein", total: "", units: "g", id: 1 },
	{ title: "carbs", total: "", units: "g", id: 2 },
	{ title: "fat", total: "", units: "g", id: 3 },
];

const initMacros: MacrosForm = {
	title: "",
	total: "",
	units: "",
	id: 0,
};

const CalorieForm = () => {
	const [form, setForm] = useState<CalorieType>({
		...initForm,
		macros: [...presetMacros],
	});
	const handleSubmit = () => {};

	const getMacroId = () => {
		return form.macros
			? form.macros.reduce((acc, macro) => Math.max(acc, macro.id) + 1, 0)
			: 0;
	};

	const handleChangeMacros = (
		name: string,
		value: string | number,
		macroId: number
	) => {
		setForm((prev) => ({
			...prev,
			macros: prev.macros?.map((m) =>
				m.id === macroId ? { ...m, [name]: value } : m
			),
		}));
	};

	const handleAddMacro = () => {
		setForm((prev) => {
			if (prev.macros)
				return {
					...prev,
					macros: [...prev.macros, { ...initMacros, id: getMacroId() }],
				};
			return prev;
		});
	};

	const handleRemoveMacro = (id: number) => {
		setForm((prev) => ({
			...prev,
			macros: prev.macros?.filter((m) => m.id !== id),
		}));
	};
	return (
		<Paper sx={{ p: 1, maxWidth: "600px" }}>
			<PageNav back={true} title="Calorie Counter" />
			<Box
				component="form"
				onSubmit={handleSubmit}
				autoComplete="off"
				className="flex-center col"
				sx={{
					padding: "10px 5px",
					gap: "10px",
				}}
			>
				<TextField
					inputMode="numeric"
					label="Max Calories /day"
					name="total"
					value={form.total.toString() || ""}
					slotProps={{ input: { inputProps: { maxLength: 4 } } }}
					required
					onChange={(e) =>
						setForm((prev) => ({ ...prev, total: stringToNum(e.target.value) }))
					}
				/>

				<Typography variant="body1">Macros</Typography>
				{form.macros?.map((macro, i) => (
					<Box key={`${macro.id}-${i}`} className="flex-around">
						<TextField
							label="Title"
							value={macro.title}
							onChange={(e) =>
								handleChangeMacros("title", e.target.value, macro.id)
							}
							fullWidth
							size="small"
							required
						/>

						<TextField
							type="text"
							label="Max /day"
							inputMode="numeric"
							value={macro.total.toString()}
							onChange={(e) => {
								handleChangeMacros(
									"max",
									stringToNum(e.target.value),
									macro.id
								);
							}}
							size="small"
							fullWidth
							required
						/>

						<FormControl fullWidth required>
							<InputLabel id={`units-${macro.id}`}>Units</InputLabel>
							<Select
								labelId={`units-${macro.id}`}
								id={`${macro.id}`}
								value={macro.units}
								label="Units"
								onChange={(e) =>
									handleChangeMacros("units", e.target.value, macro.id)
								}
								size="small"
							>
								<MenuItem value={"g"}>g</MenuItem>
								<MenuItem value={"mg"}>mg</MenuItem>
							</Select>
						</FormControl>
						<IconButton onClick={() => handleRemoveMacro(macro.id)}>
							<Remove />
						</IconButton>
					</Box>
				))}
				<IconButton onClick={handleAddMacro}>
					<Add />
				</IconButton>
				<Button variant="contained" type="submit" fullWidth>
					Submit
				</Button>
			</Box>
		</Paper>
	);
};

export default CalorieForm;
