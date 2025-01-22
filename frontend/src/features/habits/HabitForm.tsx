import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Paper,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
	BadType,
	CounterType,
	DayKey,
	DayKeys,
	DaysOfWeek,
	GoodType,
	Habit,
	HabitBase,
	HabitType,
	HabitTypes,
	isCounterHabit,
	isDayKey,
	isGoodHabit,
	isValidType,
} from "../../utils/types";
import { dayActive, dayStyle } from "../../utils/styles";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import PageNav from "../../components/PageNav";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addHabit, editHabit } from "./habitsSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { selectHabits } from "../../utils/selectors";
import { addDailyTasks } from "../tasks/tasksSlice";

const initHabit: Habit = {
	title: "",
	daysOfWeek: {
		Sunday: { isTrue: false, label: "S" },
		Monday: { isTrue: false, label: "M" },
		Tuesday: { isTrue: false, label: "T" },
		Wednesday: { isTrue: false, label: "W" },
		Thursday: { isTrue: false, label: "T" },
		Friday: { isTrue: false, label: "F" },
		Saturday: { isTrue: false, label: "S" },
	},
	type: HabitTypes.GOOD,
	createdAt: new Date().toISOString(),
	id: "",
};

const initTimeOfDay = {
	id: 0,
	time: "",
};

const initTypes: Record<HabitType, GoodType | BadType | CounterType> = {
	good: {
		timeOfDay: [{ ...initTimeOfDay }],
	},
	bad: {},
	counter: {
		minMax: false,
	},
};

const HabitForm: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { id, type } = useParams();
	const habits = useSelector(selectHabits);
	const [searchParams] = useSearchParams();

	const [habit, setHabit] = useState<Habit>({
		...initHabit,
		...initTypes[initHabit.type],
	});

	useEffect(() => {
		let habitToEdit;
		let addType;
		if (id) {
			habitToEdit = habits.find((habit) => habit.id === id);
			if (!habitToEdit) throw new Error(`Habit Not Found. ID: ${id}`);
			addType = habitToEdit.type;
		} else if (type) {
			addType = type;
		}

		if (!habitToEdit && (!addType || !isValidType(addType))) {
			navigate(-1);
			return;
		}
		if (!addType || !isValidType(addType)) {
			navigate(-1);
			return;
		}

		setHabit(
			habitToEdit
				? { ...habitToEdit, daysOfWeek: { ...habitToEdit.daysOfWeek } }
				: addType === HabitTypes.BAD
				? { ...initHabit, type: addType, ...initTypes[addType], title: "No - " }
				: { ...initHabit, type: addType, ...initTypes[addType] }
		);
	}, [id, searchParams, habits, navigate, type]);

	// GoodHabit time of day
	const getTimeId = (habit: HabitBase & GoodType) => {
		if ((habit.timeOfDay && habit.timeOfDay.length === 0) || !habit.timeOfDay)
			return 0;
		return (
			habit.timeOfDay
				.map((entry) => entry.id)
				.reduce((max, entry) => Math.max(max, entry), 0) + 1
		);
	};

	// Select All days of the week
	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;

		setHabit((prev) => {
			const newDays: DaysOfWeek = { ...prev.daysOfWeek };
			DayKeys.forEach(
				(day: DayKey) => (newDays[day] = { ...newDays[day], isTrue: checked })
			);

			return {
				...prev,
				daysOfWeek: { ...newDays },
			};
		});
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, type, value } = e.target;

		if (type === "checkbox") {
			let key: DayKey;
			if (isDayKey(name)) {
				key = name;
			} else {
				console.log("Error. Wrong Key for Days of Week.");
				return;
			}

			setHabit((prev) => ({
				...prev,
				daysOfWeek: {
					...prev.daysOfWeek,
					[key]: {
						...prev.daysOfWeek[key],
						isTrue: (e.target as HTMLInputElement).checked,
					},
				},
			}));
		} else {
			setHabit({
				...habit,
				[name]: type === "number" ? +value : value,
			});
		}
	};

	// GoodHabit timeOfDay array
	const handleChangeTime = (
		time: Dayjs | null,
		entry: { id: number; time: string }
	) => {
		let date: Date;
		if (time) {
			date = new Date(time.toISOString());

			date.setDate(date.getDate());
		}

		setHabit((prev) => {
			if (isGoodHabit(prev))
				return {
					...prev,
					timeOfDay: prev.timeOfDay.map((el) =>
						el.id === entry.id ? { ...entry, time: date?.toISOString() } : el
					),
				};
			return prev;
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (id) {
			dispatch(editHabit(habit));
			navigate(-1);
		} else {
			dispatch(addHabit(habit));
			dispatch(addDailyTasks({ habits: [habit] }));
		}
		setHabit({
			...initHabit,
			createdAt: new Date().toISOString(),
		});
	};

	return (
		<Paper sx={{ p: 1 }}>
			<PageNav back={true} title={id ? "Edit Habit" : "Add Habit"} />

			<Box
				component="form"
				onSubmit={handleSubmit}
				autoComplete="off"
				sx={{
					padding: "10px 5px",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<TextField
					label="Title"
					name="title"
					value={habit.title}
					onChange={handleChange}
					fullWidth
					slotProps={{ input: { inputProps: { maxLength: 50 } } }}
				/>

				<FormGroup
					sx={{ display: "flex", flexDirection: "column", width: "100%" }}
				>
					<FormControlLabel
						control={
							<Checkbox
								onChange={handleSelectAll}
								checked={Object.values(habit.daysOfWeek).every(
									(el) => el.isTrue
								)}
								sx={{ margin: 0 }}
							/>
						}
						label="Select All"
						sx={{ margin: 0 }}
					/>
					<Box sx={{ width: "100%" }} className="flex flex-around">
						{DayKeys.map((day, i) => {
							const week = { ...habit.daysOfWeek };
							const data = week[day];
							const name: DayKey = day;

							return (
								<FormControlLabel
									key={`${data.label}-${i}`}
									control={
										<Checkbox
											name={name}
											checked={data.isTrue}
											onChange={handleChange}
											sx={{ display: "none" }}
										/>
									}
									label={
										<Box
											sx={{ ...dayStyle, ...(data.isTrue ? dayActive : {}) }}
										>
											{data.label}
										</Box>
									}
									sx={{ margin: 0 }}
								/>
							);
						})}
					</Box>
				</FormGroup>

				{/**GoodHabit Time of Day List */}
				{isGoodHabit(habit) && (
					<Box
						className="flex-center col gap2"
						sx={{ "& > *": { width: "100%" } }}
					>
						{habit.timeOfDay.map((entry, i) => (
							<Box key={entry.id} className="flex-between gap1">
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<TimePicker
										name="timeOfDay"
										label="Time of Day"
										value={entry.time ? dayjs(entry.time) : null}
										onChange={(e) => handleChangeTime(e, entry)}
									/>
								</LocalizationProvider>
								<Box
									sx={{ color: "red" }}
									onClick={() =>
										setHabit((prev): Habit => {
											if (isGoodHabit(prev))
												return {
													...prev,
													timeOfDay: prev.timeOfDay.filter(
														(el) => el.id !== entry.id
													),
												};
											return prev;
										})
									}
								>
									<RemoveCircleOutline />
								</Box>
							</Box>
						))}
						<Button
							variant="outlined"
							onClick={() =>
								setHabit((prev): Habit => {
									if (isGoodHabit(prev))
										return {
											...prev,
											timeOfDay: [
												...prev.timeOfDay,
												{ ...initTimeOfDay, id: getTimeId(habit) },
											],
										};
									return prev;
								})
							}
							disabled={habit.timeOfDay.length >= 6}
							sx={{ width: "fit-content", alignSelf: "start" }}
						>
							<Add />
						</Button>
					</Box>
				)}

				{/** CounterHabit  */}
				{isCounterHabit(habit) && (
					<Box className="flex-center col gap2">
						<FormControlLabel
							control={
								<Switch
									checked={habit.minMax}
									onChange={(e) =>
										setHabit((prev) => {
											if (isCounterHabit(prev))
												return {
													...prev,
													minMax: e.target.checked,
												};
											return prev;
										})
									}
								/>
							}
							label={"Min / Max"}
						/>
						<Box className="flex-between">
							<Typography variant="h6">
								{habit.minMax ? "Maximum" : "Minimum"} /day
							</Typography>
							{/* <Typography variant="body2">/day</Typography> */}
							<TextField
								type="number"
								value={habit.total}
								label={"Total"}
								slotProps={{
									input: {
										inputProps: {
											inputMode: "numeric",
											min: 0,
											max: 100,
											step: 1,
										},
									},
								}}
							/>
						</Box>
					</Box>
				)}
				<Button variant="contained" type="submit">
					Submit
				</Button>
			</Box>
		</Paper>
	);
};

export default HabitForm;
