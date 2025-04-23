import {
	Box,
	Button,
	Checkbox,
	FormControl,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import PageNav from "../../components/PageNav";
import { useEffect, useRef, useState } from "react";
import {
	CounterTask,
	CounterType,
	HabitTypes,
	isCounterHabit,
	isCounterTask,
	MacrosType,
	PresetId,
} from "../../utils/types";
import { Add, CheckBox, Remove } from "@mui/icons-material";
import {
	useAddHabitMutation,
	useEditHabitMutation,
	useGetHabitsQuery,
} from "../habits/habitsApi";
import { handleError } from "../../utils/errors";
import {
	useCreateDailyTasksMutation,
	useEditTaskMutation,
	useGetDailyTasksQuery,
} from "../tasks/tasksApi";
import { useDispatch } from "react-redux";
import { setError, setLoading, setSuccess } from "../loading/loadingSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import NumberInput from "../../components/NumberInput";
import { getMaxNumFromObjArr } from "../../utils/helpers";
import { nanoid } from "nanoid";
import { NUTRIENTS } from "./NutritionConstants";
import PageWrapper from "../../components/PageWrapper";
import { useThemeMode } from "../../hooks/ThemeProvider";

const macroDefaults = new Set(["protein", "carbs", "fat"]);

const initForm: CounterType = {
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
	macros: NUTRIENTS.map((el) => ({
		...el,
		total: 0,
		active: macroDefaults.has(el.id),
	})),
};

// const initMacros: MacrosType = {
// 	label: "",
// 	total: 0,
// 	unit: "",
// 	active: true,
// 	id: "",
// };

const CalorieForm = () => {
	const [addHabit] = useAddHabitMutation();
	const [editHabit] = useEditHabitMutation();
	const [editTask] = useEditTaskMutation();
	const [createDailyTasks] = useCreateDailyTasksMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { theme, isLight } = useThemeMode();

	const { data: habit, isLoading } = useGetHabitsQuery(undefined, {
		selectFromResult: ({ data = [], isLoading }) => {
			const result = data.find((el) => el.id === PresetId.calorieCounter);
			return { data: result, isLoading };
		},
	});

	const { data: task } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [] }) => {
			const result = data.find((el) => el.habitId === PresetId.calorieCounter);
			return { data: result };
		},
	});

	const [form, setForm] = useState<CounterType>({
		...initForm,
	});

	const [incomplete, setIncomplete] = useState(false);

	if (habit && !isCounterHabit(habit))
		handleError("Error. Non counter habit in calorie form.");
	if (task && !isCounterTask(task))
		handleError("Error. Non counter task in calorie form.");

	useEffect(() => {
		if (!isLoading && habit) {
			if (isCounterHabit(habit)) {
				setForm({
					...habit,
					macros: NUTRIENTS.map((el) => {
						const exists = habit.macros?.find((m) => m.id === el.id);
						if (exists) {
							return { ...exists };
						}
						return { ...el, active: false, total: 0 };
					}),
				});
			}
		}
	}, [isLoading, habit]);

	const handleChangeMacros = (
		name: string,
		value: number | string | boolean,
		macroId: string
	) => {
		setForm((prev) => ({
			...prev,
			macros: prev.macros?.map((m) =>
				m.id === macroId ? { ...m, [name]: value } : m
			),
		}));
	};

	// const handleAddMacro = () => {
	// 	const newId = nanoid();
	// 	setForm((prev) => {
	// 		if (prev.macros)
	// 			return {
	// 				...prev,
	// 				macros: [...prev.macros, { ...initMacros, id: newId }],
	// 			};
	// 		return prev;
	// 	});
	// 	setTimeout(() => focusRef.current?.[newId]?.focus(), 0);
	// };

	// const handleRemoveMacro = (id: string) => {
	// 	setForm((prev) => ({
	// 		...prev,
	// 		macros: prev.macros?.filter((m) => m.id !== id),
	// 	}));
	// };

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			// Required field check
			if (!form.total || form.macros?.some((m) => m.active && !m.total)) {
				setIncomplete(true);
				return;
			}

			dispatch(setLoading());
			const newHabit = {
				...form,
				macros: form.macros?.filter((el) => el.active),
			};
			if (!habit) {
				console.log("adding new calorie habit");
				await addHabit(newHabit).unwrap();
				await createDailyTasks(newHabit).unwrap();
			} else if (task) {
				console.log("editing calorie task");
				const newTask: CounterTask = {
					...task,
					total: newHabit.total,
					macros: newHabit.macros?.map((el) => {
						const taskMacro = task.macros?.find((mac) => mac.id === el.id);
						return taskMacro
							? { ...el, count: taskMacro.count }
							: { ...el, count: 0 };
					}),
				};
				await editHabit(newHabit).unwrap();
				await editTask(newTask);
			}
			dispatch(setSuccess());
			setTimeout(() => navigate(-1), 750);
		} catch (e) {
			dispatch(setError("Something went wrong."));
			handleError(`Error adding calorie counter`, e);
		}
	};

	if (isLoading) return <Loading />;

	return (
		<PageWrapper
		// className="flex-between col"
		// sx={{
		// 	maxWidth: "600px",
		// 	p: 1,
		// 	"& >*": { width: "100%" },
		// }}
		>
			<PageNav back={true} title="Calorie Counter" />
			<Box sx={{ overflowY: "auto", flex: 1, marginBottom: "5px" }}>
				<Box
					component="form"
					id="calorie-form"
					onSubmit={handleSubmit}
					autoComplete="off"
					className="flex-center col gap3"
					sx={{
						padding: "10px 5px",
						width: "100%",
						"& >*": { width: "100%" },
					}}
				>
					<Paper className="flex-center" sx={{ p: 1 }}>
						<NumberInput
							label="Calories /day"
							value={form.total}
							maxLength={4}
							onChange={(value) => {
								setForm((prev) => ({
									...prev,
									total: value,
								}));
							}}
							fullWidth={false}
							error={incomplete && form.total === 0}
							sx={{ fontSize: "30px" }}
						/>
					</Paper>

					<Paper className="flex-center col gap4" sx={{ p: 1 }}>
						<Typography variant="body1" alignSelf="start">
							Macros
						</Typography>
						<TableContainer sx={{ overflow: "hidden" }}>
							<Table size="small">
								<TableHead>
									<TableRow sx={{ "& >*": { p: 1 } }}>
										<TableCell>Active</TableCell>
										<TableCell>Title</TableCell>
										<TableCell>Daily Total</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{form.macros?.map((macro, i, arr) => (
										<TableRow
											key={macro.id}
											sx={{
												// bgcolor: macro.active
												// 	? ""
												// 	: theme.palette.grey[isLight ? 200 : 800],
												bgcolor: macro.active
													? theme.palette.grey[isLight ? 100 : 900]
													: theme.palette.grey[isLight ? 200 : 800],
												"& >*": { p: 1 },
											}}
										>
											<TableCell>
												<Checkbox
													checked={macro.active}
													onChange={(e) =>
														handleChangeMacros(
															"active",
															e.target.checked,
															macro.id
														)
													}
												/>
											</TableCell>
											<TableCell>
												<Typography>{`${macro.label} (${macro.unit})`}</Typography>
												{/* <TextField
													name="title"
													variant="filled"
													value={macro.label}
													hiddenLabel
													slotProps={{
														input: { inputProps: { maxLength: 20 } },
													}}
													onChange={(e) =>
														handleChangeMacros(
															e.target.name,
															e.target.value,
															macro.id
														)
													}
													size="small"
													required
													sx={{ minWidth: "100px" }}
													inputRef={(el) => {
														return i === arr.length - 1
															? (focusRef.current[macro.id] = el)
															: null;
													}}
												/> */}
											</TableCell>
											{/* TOTAL */}
											<TableCell align="right">
												<NumberInput
													value={macro.total}
													maxLength={4}
													size={"small"}
													onChange={(value) =>
														handleChangeMacros("total", value, macro.id)
													}
													error={
														incomplete && macro.active && macro.total === 0
													}
													sx={{ minWidth: "75px" }}
													disabled={!macro.active}
												/>
											</TableCell>
											{/* <TableCell align="right">
												<FormControl fullWidth required>
													<Select
														id={`${macro.id}`}
														value={macro.unit}
														name="units"
														onChange={(e) =>
															handleChangeMacros(
																e.target.name,
																e.target.value,
																macro.id
															)
														}
														size="small"
														variant="standard"
													>
														<MenuItem value={"g"}>g</MenuItem>
														<MenuItem value={"mg"}>mg</MenuItem>
													</Select>
												</FormControl>
											</TableCell> */}
											{/* <TableCell>
												<Remove
													onClick={() => handleRemoveMacro(macro.id)}
													fontSize="small"
												/>
											</TableCell> */}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
						{/* <IconButton onClick={handleAddMacro}>
							<Add />
						</IconButton> */}
					</Paper>
				</Box>
			</Box>
			<Button variant="contained" type="submit" form="calorie-form" fullWidth>
				Submit
			</Button>
		</PageWrapper>
	);
};

export default CalorieForm;
