import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormLabel,
	IconButton,
	Paper,
	Switch,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	SxProps,
	Theme,
} from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
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
	isNoneTimer,
	isTimerType,
	isValidHabitType,
	NoneTimer,
	RoundTimer,
	SingleTimer,
	Timer,
	TimerType,
	TimerTypes,
} from "../../utils/types";
import { dayActive, dayStyle } from "../../utils/styles";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import PageNav from "../../components/PageNav";
import { Add, AddCircle, RemoveCircleOutline } from "@mui/icons-material";
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
import DurationPicker from "../../components/DurationPicker";
import NumberField from "../../components/NumberField";
import PageWrapper from "../../components/PageWrapper";
import QtyField from "../../components/QtyField";

export const initHabit: HabitBase = {
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

const initNoneTimer: NoneTimer = {
	type: TimerTypes.NONE,
};

const initSingleTimer: SingleTimer = {
	type: TimerTypes.SINGLE,
	duration: 0,
};
const initRoundTimer: RoundTimer = {
	type: TimerTypes.ROUND,
	duration: 0,
	rounds: 1,
	breakDuration: 0,
	sets: 1,
};

const initTimers: Record<TimerType, Timer> = {
	[TimerTypes.NONE]: { ...initNoneTimer },
	[TimerTypes.SINGLE]: { ...initSingleTimer },
	[TimerTypes.ROUND]: { ...initRoundTimer },
};

export const initTypes: Record<HabitType, Habit> = {
	good: {
		...initHabit,
		timeOfDay: [],
		allDay: true,
		type: HabitTypes.GOOD,
		timer: { ...initNoneTimer },
	},
	bad: {
		...initHabit,
		title: "No - ",
		type: HabitTypes.BAD,
	},
	counter: {
		...initHabit,
		type: HabitTypes.COUNTER,
		isMax: false,
		total: 0,
	},
};

export const SectionContainer = ({
	children,
	title,
	fullWidth,
	fullHeight,
	className,
	wrapperSx,
	paperSx,
}: {
	children: React.ReactNode;
	title?: string;
	fullWidth?: boolean;
	fullHeight?: boolean;
	className?: string;
	wrapperSx?: SxProps<Theme>;
	paperSx?: SxProps<Theme>;
}) => {
	return (
		<Box
			className={`${fullWidth ? "full-w" : ""} ${fullHeight ? "full-h" : ""} `}
			p={"2px 4px"}
			sx={wrapperSx}
		>
			{title && (
				<Typography
					variant="subtitle2"
					sx={{
						float: "left",
						width: "100%",
						padding: "2px 15px 0",
						color: "primary.main",
					}}
				>
					{title}
				</Typography>
			)}
			<Paper
				elevation={3}
				className={`flex col gap2 full-w full-h ${className}`}
				sx={{
					// justifyContent: "flex-start",
					// alignItems: "flex-start",
					//minHeight: fullHeight ? "100%" : "fit-content",
					p: 1,
					// "& > *": { width: "100%" },
					...paperSx,
				}}
			>
				{children}
			</Paper>
		</Box>
	);
};

const HabitForm = () => {
	const navigate = useNavigate();
	const { id, type } = useParams();
	const dispatch = useDispatch();
	const { data: habits } = useGetHabitsQuery();
	const onAcceptRef = useRef(false);
	const [addHabit] = useAddHabitMutation();
	const [editHabit] = useEditHabitMutation();
	const [createDailyTasks] = useCreateDailyTasksMutation();
	const { data: dailyTasks } = useGetDailyTasksQuery();
	const [deleteTasks] = useDeleteTasksMutation();

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
		if (type && isValidHabitType(type)) return type;
		handleError(
			`Habit Form: Habit type not found. Type: ${type}, habitToEdit: ${habitToEdit}`,
			{}
		);
	}, [type, habitToEdit]);

	const [habit, setHabit] = useState<Habit>({
		...(habitToEdit ?? initTypes[habitType]),
	});
	const [selectingTime, setSelectingTime] = useState<boolean>(false);

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
	const handleAddTime = (time: Dayjs | null) => {
		console.log("add time start");

		setHabit((prev) => {
			if (isGoodHabit(prev))
				if (time) {
					return {
						...prev,
						timeOfDay: [
							...prev.timeOfDay,
							{ id: getTimeId(prev), time: time.toISOString() },
						],
					};
				} else {
					if (prev.timeOfDay.length === 0) return { ...prev, allDay: true };
				}
			return prev;
		});
	};

	// GoodHabit - edit existing timeOfDay array element
	const handleChangeTime = (
		time: Dayjs | null,
		entry: { id: number; time: string }
	) => {
		console.log("handle change time");
		let date: Date;
		if (time) {
			date = new Date(time.toISOString());

			date.setDate(date.getDate());
		}
		setHabit((prev) => {
			if (isGoodHabit(prev)) {
				if (date) {
					console.log("date exists");
					return {
						...prev,
						timeOfDay: prev.timeOfDay.map((el) =>
							el.id === entry.id ? { ...entry, time: date.toISOString() } : el
						),
					};
				} else {
					console.log("No date exists");
					if (prev.timeOfDay.length === 0) {
						return { ...prev, allDay: true };
					} else {
						return prev;
					}
				}
			}
			return prev;
		});
	};

	// GoodHabit - set timers - TYPE
	const handleTimerType = (
		event: React.MouseEvent<HTMLElement>,
		type: string
	) => {
		setHabit((prev) => {
			if (isGoodHabit(prev) && isTimerType(type)) {
				return { ...prev, timer: { ...initTimers[type] } };
			}
			return prev;
		});
	};

	// goodhabit - set timer duration for single / round
	const handleTimerDuration = (
		msDuration: number,
		type: "duration" | "break"
	) => {
		setHabit((prev) => {
			if (isGoodHabit(prev)) {
				if (type === "duration")
					return { ...prev, timer: { ...prev.timer, duration: msDuration } };

				if (type === "break")
					return {
						...prev,
						timer: { ...prev.timer, breakDuration: msDuration },
					};
			}
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
			handleError("Error submitting habit form.", e);
		}
	};

	return (
		// <Box className="flex col gap2 full-h" sx={{ p: 1, maxWidth: "600px" }}>
		<PageWrapper>
			<PageNav back title={id ? "Edit Habit" : "Add Habit"} />

			<Box
				className="flex col gap4 full-h full-w"
				id="habitForm"
				component="form"
				onSubmit={handleSubmit}
				autoComplete="off"
				sx={{
					padding: "10px 5px",
					flex: 1,
					overflowY: "auto",
					"& >*": { width: "100%" },
				}}
			>
				<SectionContainer title="Details" fullWidth>
					{/* Title */}
					<TextField
						label="Title"
						name="title"
						value={habit.title}
						onChange={handleChange}
						fullWidth
						slotProps={{ input: { inputProps: { maxLength: 50 } } }}
						required
					/>

					{/*Days Of Week */}
					<FormGroup
						className="flex col gap2 full-w"
						sx={{ "& >*": { width: "100%" } }}
					>
						<FormControlLabel
							control={
								<Checkbox
									onChange={handleSelectAll}
									checked={Object.values(habit.daysOfWeek).every(
										(el) => el.isTrue
									)}
								/>
							}
							label="Select All"
							sx={{ justifySelf: "flex-start" }}
						/>
						{/* Days of the Week */}
						<Box className="flex flex-around">
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
				</SectionContainer>

				{/**GoodHabit */}

				{isGoodHabit(habit) && (
					<Box
						className="flex-center col gap2"
						sx={{ "& > *": { width: "100%" } }}
					>
						{/* All Day checkbox */}

						<SectionContainer title="Times of Day" fullWidth>
							<FormControlLabel
								control={
									<Checkbox
										onChange={({ target: { checked } }) => {
											setSelectingTime(!checked);
											setHabit((prev) => {
												if (isGoodHabit(prev)) {
													return {
														...prev,
														allDay: !prev.allDay,
														timeOfDay: [],
													};
												}
												return prev;
											});
										}}
										checked={habit.allDay}
									/>
								}
								label="All Day"
								sx={{ width: "100%" }}
							/>
							<Box className="flex-center col gap3 full-w full-h">
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
															handleChangeTime(e, entry);
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
							</Box>
							{selectingTime && (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<TimePicker
										name="timeOfDay"
										label="Time of Day"
										value={null}
										onAccept={(e) => {
											handleAddTime(e);
											onAcceptRef.current = true;
											setSelectingTime(false);
										}}
										open
										onClose={() => {
											if (!onAcceptRef.current) handleAddTime(null);
											onAcceptRef.current = false;
											setSelectingTime(false);
										}}
									/>
								</LocalizationProvider>
							)}
							{/* Add Timeslot Button */}
							{!habit.allDay && (
								<Box className="flex-center full-w">
									<IconButton
										onClick={() => setSelectingTime(true)}
										disabled={habit.timeOfDay.length >= 6 || selectingTime}
										sx={{ width: "fit-content", alignSelf: "start" }}
										size="large"
									>
										<AddCircle fontSize="large" />
									</IconButton>
								</Box>
							)}
						</SectionContainer>

						{/* Timers */}
						<SectionContainer
							title="Timers"
							fullWidth
							paperSx={{ "& >*": { width: "100%" } }}
						>
							<FormControlLabel
								control={
									<Switch
										checked={habit.timer.type !== TimerTypes.NONE}
										onChange={({ target }) => {
											setHabit((prev) => {
												if (isGoodHabit(prev))
													return {
														...prev,
														timer: !target.checked
															? { ...initNoneTimer }
															: {
																	...initSingleTimer,
															  },
													};
												return prev;
											});
										}}
									/>
								}
								label="Timer"
								sx={{ width: "100%" }}
							/>
							{!isNoneTimer(habit.timer) && (
								<Box className="flex-center col" sx={{ gap: "25px" }}>
									<ToggleButtonGroup
										color="primary"
										value={habit.timer.type}
										exclusive
										onChange={handleTimerType}
									>
										<ToggleButton size="small" value={TimerTypes.SINGLE}>
											Single
										</ToggleButton>
										<ToggleButton size="small" value={TimerTypes.ROUND}>
											Round
										</ToggleButton>
									</ToggleButtonGroup>

									{/* Single Timer */}
									<Box
										className="flex col"
										sx={{
											width: "100%",
											gap: "10px",
											"& > *": { width: "100%" },
										}}
									>
										{habit.timer.type === TimerTypes.SINGLE && (
											<Box className="flex-between">
												<FormLabel>Duration</FormLabel>
												<DurationPicker
													handleChange={(num) =>
														handleTimerDuration(num, "duration")
													}
													value={habit.timer.duration}
												/>
											</Box>
										)}

										{/* Round Timer */}
										{habit.timer.type === TimerTypes.ROUND && (
											<>
												<Box className="flex-between" sx={{ width: "100%" }}>
													<FormLabel>Number of Sets</FormLabel>
													{/* <NumberField
														value={habit.timer.sets}
														min={1}
														max={10}
														handleChange={(num) =>
															setHabit((prev) => {
																if (isGoodHabit(prev)) {
																	return {
																		...prev,
																		timer: { ...prev.timer, sets: num },
																	};
																}
																return prev;
															})
														}
													/> */}
													<QtyField
														min={1}
														max={10}
														value={habit.timer.sets}
														onChange={(num) =>
															setHabit((prev) => {
																if (isGoodHabit(prev)) {
																	return {
																		...prev,
																		timer: { ...prev.timer, sets: num },
																	};
																}
																return prev;
															})
														}
													/>
												</Box>
												<Box className="flex-between" sx={{ width: "100%" }}>
													<FormLabel>Rounds per Set</FormLabel>
													{/* <NumberField
														value={habit.timer.rounds}
														min={1}
														handleChange={(num) =>
															setHabit((prev) => {
																if (isGoodHabit(prev)) {
																	return {
																		...prev,
																		timer: { ...prev.timer, rounds: num },
																	};
																}
																return prev;
															})
														}
													/> */}
													<QtyField
														min={1}
														max={20}
														value={habit.timer.rounds}
														onChange={(num) =>
															setHabit((prev) => {
																if (isGoodHabit(prev)) {
																	return {
																		...prev,
																		timer: { ...prev.timer, rounds: num },
																	};
																}
																return prev;
															})
														}
													/>
												</Box>
												<Box className="flex-between">
													<FormLabel>Duration per Round</FormLabel>
													<DurationPicker
														handleChange={(num) =>
															handleTimerDuration(num, "duration")
														}
														value={habit.timer.duration}
													/>
												</Box>
												<Box className="flex-between">
													<FormLabel>Break per Round</FormLabel>
													<DurationPicker
														handleChange={(num) =>
															handleTimerDuration(num, "break")
														}
														value={habit.timer.breakDuration}
													/>
												</Box>
											</>
										)}
									</Box>
								</Box>
							)}
						</SectionContainer>
					</Box>
				)}

				{/** CounterHabit  */}
				{isCounterHabit(habit) && (
					<Box className="flex-center col gap2">
						<FormControlLabel
							control={
								<Switch
									checked={habit.isMax}
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
								{habit.isMax ? "Maximum" : "Minimum"} /day
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
			</Box>
			<Box className="full-w">
				<Button variant="contained" type="submit" fullWidth form="habitForm">
					Submit
				</Button>
			</Box>
		</PageWrapper>
		// </Box>
	);
};

export default HabitForm;
