import { Box, Button, Paper, Tab, Tabs, Typography } from "@mui/material";
import PageNav from "../../components/PageNav";
import { SyntheticEvent, useEffect, useState } from "react";
import { useEditTaskMutation, useGetDailyTasksQuery } from "../tasks/tasksApi";
import { isCounterTask, MacrosTask, PresetId } from "../../utils/types";
import { handleError } from "../../utils/errors";
import Loading from "../../components/Loading";
import SemiCircleBar from "../../components/SemiCircleBar";
import CustomLog from "./CustomLog";
import { useDispatch, useSelector } from "react-redux";
import { selectCalories } from "./caloriesSelectors";
import { setCalories, setInitValues, submitBasket } from "./CaloriesSlice";
import { ShoppingBasket } from "@mui/icons-material";

const a11yProps = (index: number) => ({
	id: `simple-tab-${index}`,
	"aria-controls": `simple-tabpanel-${index}`,
});

interface TabProps {
	children: React.ReactNode;
	value: number;
	index: number;
}

const CustomTabPanel = ({ children, value, index }: TabProps) => {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			style={{ height: "100%", minHeight: 0, overflow: "hidden" }}
		>
			{value === index && <Box sx={{ p: 1, height: "100%" }}>{children}</Box>}
		</div>
	);
};

const CalorieLog = () => {
	const dispatch = useDispatch();
	const { calories, macros } = useSelector(selectCalories);

	const [editTask] = useEditTaskMutation();

	const { data: task, isLoading } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [], isLoading }) => {
			const result = data.find((el) => el.habitId === PresetId.calorieCounter);
			if (result && !isCounterTask(result)) {
				handleError("Calorie task is not counter.");
			}
			return { data: result, isLoading };
		},
	});

	// const [calories, setCalories] = useState({
	// 	...initCal,
	// 	display: task?.count ?? 0,
	// });
	// const [macros, setMacros] = useState<any[]>(
	// 	task?.macros
	// 		? task.macros.map((el) => ({ ...el, amount: 0, display: 0 }))
	// 		: []
	// );

	const [value, setValue] = useState(0);

	useEffect(() => {
		if (task) {
			dispatch(setInitValues(task));
			//setCalories((prev) => ({ ...prev, display: task.count }));
			//setDisplayCal(task.count);
			//setDisplayMac(task.macros?.map((el) => ({ id: el.id })));
			//dispatch(setCalories(task.count));
		}
	}, [task, dispatch]);

	if (isLoading) {
		return <Loading />;
	} else if (!task) return <Typography>Calorie Task not found.</Typography>;

	const handleChangeTabs = (_e: SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	// const handleChangeCalories = (value: number) => {
	// 	//setCalories((prev) => ({ ...prev, value: value }));
	// 	dispatch(setCalories(value));
	// };

	// const handleCalorieDisplay = () => {
	// 	setCalories((prev) => ({
	// 		...prev,
	// 		display: prev.value + (task?.count ?? 0),
	// 	}));
	// };

	// const handleChangeMacros = (value: number, id: string) => {
	// 	setMacros((prev) =>
	// 		prev.map((m) => (m.id === id ? { ...m, amount: value } : m))
	// 	);
	// };

	// const handleMacroDisplay = (id: string) => {
	// 	setMacros((prev) =>
	// 		prev.map((mac) =>
	// 			mac.id === id && mac.display !== mac.amount
	// 				? { ...mac, display: mac.amount ?? 0 }
	// 				: mac
	// 		)
	// 	);
	// };

	const handleSubmit = () => {
		if (task && (calories.amount || macros.some((el) => el.amount))) {
			editTask({
				...task,
				count: task.count + calories.amount,
				macros: task.macros?.map((mac: MacrosTask) => {
					const macAddAmount = macros.find((el) => el.id === mac.id)?.amount;
					if (macAddAmount == null)
						handleError(`Cannot find macro element in macros state. ${mac.id}`);

					return {
						...mac,
						count: mac.count + macAddAmount,
					};
				}),
			});
			dispatch(submitBasket(task));
			// setCalories((prev) => ({
			// 	...prev,
			// 	value: 0,
			// }));
			// setMacros(
			// 	task?.macros
			// 		? task.macros.map((el) => ({
			// 				...el,
			// 				amount: 0,
			// 				display: 0,
			// 		  }))
			// 		: []
			// );
		}
	};

	return (
		<Box
			className="flex-between col gap2"
			sx={{
				p: 1,
				overflow: "hidden",
				minHeight: 0,
				height: "100%",
				"& >*": { width: "100%" },
			}}
		>
			<PageNav back={true} title="Log Calories" />

			{/* Current Calorie/Macros Count */}
			<Paper
				className="flex-center col gap2"
				sx={{ p: 2, minHeight: 0, flex: 1, maxHeight: "40%" }}
			>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "2fr 1fr 2fr",
						alignItems: "end",
						width: "100%",
					}}
				>
					<Typography
						variant="h6"
						sx={{
							alignSelf: "center",
							textAlign: "center",
							color: "green",
						}}
					>
						{calories.amount > 0 && `+${calories.amount}`}
					</Typography>
					<Typography
						variant="h3"
						sx={{
							textAlign: "center",
							color:
								calories.amount + task.count > task.total
									? "red"
									: calories.amount === 0
									? "black"
									: "green",
						}}
					>
						{calories.amount + task.count}
					</Typography>
					<Typography variant="h5" sx={{ textAlign: "left" }}>
						/{task.total}
					</Typography>
				</Box>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))",
						rowGap: 1,
						textAlign: "center",
						width: "100%",
						overflowY: "auto",
						flex: 1,
						minHeight: 0,
					}}
				>
					{task?.macros &&
						task.macros.map((macro) => {
							const amount =
								macros.find((el) => el.id === macro.id)?.amount ?? 0;

							return (
								<Box key={macro.id} sx={{ p: 0, m: 0 }}>
									<Typography
										variant="body2"
										sx={{
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
											borderBottom: "1px solid #00000080",
											//fontWeight: "1.5",
										}}
									>
										{macro.title}
									</Typography>
									<SemiCircleBar
										count={macro.count}
										total={macro.total}
										units={macro.units}
										addAmount={amount}
									/>
								</Box>
							);
						})}
				</Box>
			</Paper>

			{/* Calorie Input */}
			<Box
				className="flex-center col"
				sx={{ width: "100%", flex: 1, overflow: "hidden", maxHeight: "50%" }}
			>
				<Box
					sx={{
						width: "100%",
						borderBottom: 1,
						borderColor: "divider",
						justifyContent: "center",
					}}
				>
					<Tabs
						value={value}
						onChange={handleChangeTabs}
						aria-label="basic tabs example"
						centered
					>
						<Tab label="Custom" {...a11yProps(0)} />
						<Tab label="Ingredients" {...a11yProps(1)} />
						<Tab label="Meals" {...a11yProps(2)} />
						<Tab
							label={<ShoppingBasket />}
							{...a11yProps(3)}
							sx={{ minWidth: "50px", width: "50px", padding: "0" }}
						/>
					</Tabs>
				</Box>
				<Box sx={{ flex: 1, height: "100%", minHeight: 0 }}>
					<CustomTabPanel value={value} index={0}>
						{/* Custom Logging */}
						<CustomLog
							calories={calories.amount}
							macros={macros}
							//delayChange={true}
							//handleChangeCalories={handleChangeCalories}
							// handleChangeMacros={handleChangeMacros}
							// handleCalorieDisplay={handleCalorieDisplay}
							// handleMacroDisplay={handleMacroDisplay}
						/>
					</CustomTabPanel>
					<CustomTabPanel value={value} index={1}>
						Item Two Content
					</CustomTabPanel>
					<CustomTabPanel value={value} index={2}>
						Item Three Content
					</CustomTabPanel>
					<CustomTabPanel value={value} index={3}>
						Item Three Content
					</CustomTabPanel>
				</Box>
			</Box>

			<Button variant="contained" onClick={handleSubmit}>
				Submit
			</Button>
		</Box>
	);
};

export default CalorieLog;
