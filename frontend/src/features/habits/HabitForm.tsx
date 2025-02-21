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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
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
import { useNavigate, useParams } from "react-router-dom";
import {
	useAddHabitMutation,
	useEditHabitMutation,
	useGetHabitsQuery,
} from "./habitsApi";
import { nanoid } from "nanoid";
import { handleError } from "../../utils/errors";
import {
	useCreateDailyTasksMutation,
	useDeleteTasksMutation,
	useGetDailyTasksQuery,
} from "../tasks/tasksApi";
import { useDispatch } from "react-redux";
import { setError, setLoading, setSuccess } from "../loading/loadingSlice";

const initHabit: HabitBase = {
	title: "",
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
	id: "",
};

const initTypes: Record<HabitType, Habit> = {
	good: {
		...initHabit,
		timeOfDay: [],
		allDay: true,
		type: HabitTypes.GOOD,
	},
	bad: {
		...initHabit,
		title: "No - ",
		type: HabitTypes.BAD,
	},
	counter: {
		...initHabit,
		type: HabitTypes.COUNTER,
		max: false,
		total: 0,
	},
};

const HabitForm = () => {
	const navigate = useNavigate();
	const { id, type } = useParams();
	const dispatch = useDispatch();
	const { data: habits } = useGetHabitsQuery();

	const [
		addHabit,
		// { isLoading: addLoading, isSuccess: addSuccess, error: addError },
	] = useAddHabitMutation();

	const [
		editHabit,
		// { isLoading: editLoading, isSuccess: editSuccess, error: editError },
	] = useEditHabitMutation();

	const [
		createDailyTasks,
		// {
		// 	isLoading: loadingCreateTasks,
		// 	isSuccess: createTasksSuccess,
		// 	error: createTasksError,
		// },
	] = useCreateDailyTasksMutation();

	const { data: dailyTasks } = useGetDailyTasksQuery();

	const [deleteTasks] = useDeleteTasksMutation();

	// const isLoadingSubmit = useMemo(
	// 	() => editLoading || addLoading || loadingCreateTasks,
	// 	[editLoading, addLoading, loadingCreateTasks]
	// );
	// const errorSubmit = useMemo(
	// 	() => addError || editError || createTasksError,
	// 	[addError, editError, createTasksError]
	// );
	// const successSubmit = useMemo(
	// 	() => !isLoadingSubmit && !errorSubmit && (addSuccess || editSuccess),
	// 	[isLoadingSubmit, errorSubmit, addSuccess, editSuccess]
	// );

	// Check if editing or adding new Habit
	const habitToEdit = useMemo(() => {
		if (!id) return undefined;
		const thisHabit = habits?.find((habit) => habit.id === id);
		if (!thisHabit) handleError("habitToEdit: Habit not found");
		return thisHabit;
	}, [id, habits]);

	// Get the habit type (good, bad, counter)
	const habitType = useMemo(() => {
		if (habitToEdit) return habitToEdit.type;
		if (type && isValidType(type)) return type;
		handleError(
			`Habit Form: Habit type not found. Type: ${type}, habitToEdit: ${habitToEdit}`
		);
	}, [type, habitToEdit]);

	const [habit, setHabit] = useState<Habit>({
		...(habitToEdit ?? initTypes[habitType]),
	});

	const [selectingTime, setSelectingTime] = useState<boolean>(false);

	// const handleNavigateBack = useCallback(() => {
	// 	navigate(-1);
	// }, [navigate]);

	// Submit Loading / Success / Error
	// useEffect(() => {
	// 	console.log("form useEffect render");
	// 	if (isLoadingSubmit) {
	// 		dispatch(setLoading());
	// 	} else if (errorSubmit) {
	// 		dispatch(
	// 			setError(editError ? "Error editing habit." : "Error adding habit.")
	// 		);
	// 	} else if (successSubmit) {
	// 		console.log("success submit ");
	// 		dispatch(setSuccess("Success"));
	// 		setTimeout(() => handleNavigateBack(), 750);
	// 	}
	// }, [
	// 	isLoadingSubmit,
	// 	errorSubmit,
	// 	dispatch,
	// 	editError,
	// 	successSubmit,
	// 	handleNavigateBack,
	// ]);

	// GoodHabit - get time of day id
	const getTimeId = (habit: GoodType) => {
		if ((habit.timeOfDay && !habit.timeOfDay.length) || !habit.timeOfDay)
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

	// Generic field changes for string and number properties and days of week checkbox
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

	// GoddHabit - add new timeOfDay element to array
	const handleAddTime = (time: Dayjs) => {
		setHabit((prev) => {
			if (isGoodHabit(prev))
				return {
					...prev,
					timeOfDay: [
						...prev.timeOfDay,
						{ id: getTimeId(prev), time: time.toISOString() },
					],
				};
			return prev;
		});
	};

	// GoodHabit - edit existing timeOfDay array element
	const handleChangeTime = (
		time: Dayjs,
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			dispatch(setLoading());
			if (habitToEdit) {
				await editHabit(habit).unwrap();
				const tasksToDelete =
					dailyTasks?.filter(
						(task) => task.habitId === habit.id && !task.complete
					) ?? [];

				if (tasksToDelete.length) {
					await deleteTasks(tasksToDelete).unwrap();
				}
				await createDailyTasks(habit).unwrap();
			} else {
				const newHabit = await addHabit({
					...habit,
					id: nanoid(),
				}).unwrap();
				await createDailyTasks(newHabit).unwrap();
			}
			dispatch(setSuccess());
			setTimeout(() => navigate(-1), 750);
		} catch (e) {
			dispatch(setError("Something went wrong."));
			handleError(e);
		}
	};

	return (
		<Paper sx={{ p: 1, maxWidth: "600px" }}>
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
					required
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
						{/* All Day checkbox */}
						<FormControlLabel
							control={
								<Checkbox
									onChange={({ target: { checked } }) => {
										setSelectingTime(!checked);
										setHabit((prev) => {
											if (isGoodHabit(prev)) {
												return { ...prev, allDay: !prev.allDay, timeOfDay: [] };
											}
											return prev;
										});
									}}
									checked={habit.allDay}
									sx={{ margin: 0 }}
								/>
							}
							label="All Day"
							sx={{ margin: 0 }}
						/>
						{!habit.allDay &&
							habit.timeOfDay
								.slice()
								.sort((a, b) => {
									return (
										new Date(a.time).getTime() - new Date(b.time).getTime()
									);
								})
								.map((entry) => (
									<Box key={entry.id} className="flex-between gap1">
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<TimePicker
												name="timeOfDay"
												label="Time of Day"
												value={dayjs(entry.time)}
												onChange={(e) => {
													if (e) handleChangeTime(e, entry);
												}}
												disabled={habit.allDay}
											/>
										</LocalizationProvider>

										<Button
											sx={{ color: "red" }}
											onClick={() =>
												setHabit((prev) => {
													if (isGoodHabit(prev))
														return {
															...prev,
															timeOfDay: prev.timeOfDay.filter(
																(el) => el.id !== entry.id
															),
															allDay: prev.timeOfDay.length === 1,
														};
													return prev;
												})
											}
										>
											<RemoveCircleOutline />
										</Button>
									</Box>
								))}
						{selectingTime && (
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<TimePicker
									name="timeOfDay"
									label="Time of Day"
									value={null}
									onAccept={(e) => {
										if (e) {
											handleAddTime(e);
											setSelectingTime(false);
										}
									}}
									open
									onClose={() => setSelectingTime(false)}
								/>
							</LocalizationProvider>
						)}
						{!habit.allDay && (
							<Button
								variant="outlined"
								onClick={() => setSelectingTime(true)}
								disabled={habit.timeOfDay.length >= 6 || selectingTime}
								sx={{ width: "fit-content", alignSelf: "start" }}
							>
								<Add />
							</Button>
						)}
					</Box>
				)}

				{/** CounterHabit  */}
				{isCounterHabit(habit) && (
					<Box className="flex-center col gap2">
						<FormControlLabel
							control={
								<Switch
									checked={habit.max}
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
								{habit.max ? "Maximum" : "Minimum"} /day
							</Typography>
							{/* <Typography variant="body2">/day</Typography> */}
							<TextField
								type="number"
								name="total"
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
								onChange={handleChange}
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
