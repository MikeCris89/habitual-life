import {
	Box,
	Button,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
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
import { Add, Remove } from "@mui/icons-material";
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
	macros: [
		{ title: "protein", total: 0, units: "g", id: nanoid() },
		{ title: "carbs", total: 0, units: "g", id: nanoid() },
		{ title: "fat", total: 0, units: "g", id: nanoid() },
	],
};

const initMacros: MacrosType = {
	title: "",
	total: 0,
	units: "",
	id: "",
};

const CalorieForm = () => {
	const [addHabit] = useAddHabitMutation();
	const [editHabit] = useEditHabitMutation();
	const [editTask] = useEditTaskMutation();
	const [createDailyTasks] = useCreateDailyTasksMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

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

	if (habit && !isCounterHabit(habit))
		handleError("Error. Non counter habit in calorie form.");
	if (task && !isCounterTask(task))
		handleError("Error. Non counter task in calorie form.");

	const maxMacroId = useRef(0);

	useEffect(() => {
		if (!isLoading && habit) {
			if (isCounterHabit(habit)) {
				maxMacroId.current = habit.macros
					? getMaxNumFromObjArr(habit.macros, "id", 0)
					: 0;
				setForm({ ...habit });
			}
		}
	}, [isLoading, habit]);

	const handleChangeMacros = (
		name: string,
		value: number | string,
		macroId: string
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
					macros: [...prev.macros, { ...initMacros, id: nanoid() }],
				};
			return prev;
		});
	};

	const handleRemoveMacro = (id: string) => {
		setForm((prev) => ({
			...prev,
			macros: prev.macros?.filter((m) => m.id !== id),
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			// Required field check
			if (
				!form.total ||
				form.macros?.some((m) => !m.title.trim() || !m.total)
			) {
				console.log("entry not valid");
				dispatch(setError("Please fill out all fields correctly."));
				return;
			}

			dispatch(setLoading());
			if (!habit) {
				console.log("adding new calorie habit");
				await addHabit(form).unwrap();
				await createDailyTasks(form).unwrap();
			} else if (task) {
				console.log("editing calorie task");
				const newTask: CounterTask = {
					...task,
					total: form.total,
					macros: form.macros?.map((el) => {
						const taskMacro = task.macros?.find((mac) => mac.id === el.id);
						return taskMacro
							? { ...el, count: taskMacro.count }
							: { ...el, count: 0 };
					}),
				};
				await editHabit(form).unwrap();
				await editTask(newTask);
			}
			dispatch(setSuccess());
			setTimeout(() => navigate(-1), 750);
		} catch (e) {
			dispatch(setError("Something went wrong."));
			handleError(`Error adding calorie counter: ${e}`);
		}
	};

	if (isLoading) return <Loading />;

	return (
		<Box
			className="flex-between col"
			sx={{
				maxWidth: "600px",
				p: 1,
				"& >*": { width: "100%" },
			}}
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
							onChange={(value) =>
								setForm((prev) => ({
									...prev,
									total: value,
								}))
							}
							fullWidth={false}
						/>
					</Paper>

					<Paper className="flex-center col gap4" sx={{ p: 1 }}>
						<Typography variant="body1" alignSelf="start">
							Macros
						</Typography>
						{form.macros?.map((macro, i) => (
							<Box key={`${macro.id}-${i}`} className="flex-around">
								<TextField
									label="Title"
									name="title"
									value={macro.title}
									slotProps={{ input: { inputProps: { maxLength: 20 } } }}
									onChange={(e) =>
										handleChangeMacros(e.target.name, e.target.value, macro.id)
									}
									//fullWidth
									size="small"
									required
									sx={{ minWidth: "150px" }}
								/>

								<NumberInput
									label={"Total"}
									value={macro.total}
									maxLength={4}
									size={"small"}
									onChange={(value) =>
										handleChangeMacros("total", value, macro.id)
									}
								/>

								<FormControl fullWidth required>
									<InputLabel id={`units-${macro.id}`}>Units</InputLabel>
									<Select
										labelId={`units-${macro.id}`}
										id={`${macro.id}`}
										value={macro.units}
										label="Units"
										name="units"
										onChange={(e) =>
											handleChangeMacros(
												e.target.name,
												e.target.value,
												macro.id
											)
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
					</Paper>
				</Box>
			</Box>
			<Button variant="contained" type="submit" form="calorie-form" fullWidth>
				Submit
			</Button>
		</Box>
	);
};

export default CalorieForm;
