import { Box, Paper, Typography } from "@mui/material";
import { DayKeys, GoodTask } from "../../utils/types";
import dayjs from "dayjs";
import { startOfWeek } from "../../utils/timeUtils";
import { CalendarIcon } from "@mui/x-date-pickers";
import "./calendarStyles.css";
import { useThemeMode } from "../../hooks/ThemeProvider";

interface Props {
	tasks: GoodTask[];
}

const GoodCalendar = ({ tasks }: Props) => {
	const weekStart = startOfWeek();
	const { isLight, theme } = useThemeMode();
	const columns = [
		{ label: "", date: "" },
		...DayKeys.map((day, i) => ({
			label: day.slice(0, 1),
			date: new Date(
				new Date(weekStart).setDate(new Date(weekStart).getDate() + i)
			).toISOString(),
		})),
	];
	const { min, max } = tasks.reduce<{ min: number; max: number }>(
		(acc, task) => {
			if (!task.allDay) {
				acc.min = Math.max(
					0,
					Math.min(acc.min, new Date(task.dateTime).getHours() - 1)
				);
				acc.max = Math.min(
					23,
					Math.max(acc.max, new Date(task.dateTime).getHours() + 1)
				);
			}
			return acc;
		},
		{ min: 7, max: 22 }
	);
	const rows = [
		{ label: "", date: "" },
		{ label: "All Day", date: "" },
	];

	for (let x = min; x <= max; x++) {
		const labelDate = new Date();
		labelDate.setHours(x, 0, 0, 0);
		rows.push({
			label: dayjs(labelDate).format("HH:mm"),
			date: labelDate.toISOString(),
		});
	}

	return (
		<Box
			sx={{
				overflowY: "auto",
				overflowX: "hidden",
				minHeight: 0,
				width: "100%",
				maxWidth: "900px",
				padding: "5px",
				flex: 1,
			}}
		>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "30px repeat(7, 1fr)",
					gridAutoRows: "minmax(20px, auto)",
					maxWidth: "100%",
					minWidth: 0,
					border: "1px solid  rgba(0, 0, 0, 0.3)",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
					borderRadius: "8px",
					height: "100%",
					"& > *": {
						//borderRight: "1px solid rgba(0, 0, 0, 0.3)",
						//borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
					},
				}}
			>
				{columns.map((col, colIndex) => {
					return rows.map((row, rowIndex) => {
						// Calendar Icon - box top left
						if (rowIndex === 0 && colIndex === 0)
							return (
								<Box
									key={`${colIndex}-${rowIndex}`}
									className="flex-center"
									sx={{
										gridColumn: 1,
										gridRow: 1,
										borderRadius: "8px 0 0 0",
									}}
								>
									<CalendarIcon />
								</Box>
							);

						// Column labels - 1st row
						if (rowIndex === 0)
							return (
								<Box
									key={`${colIndex}-${rowIndex}`}
									className={`flex-center col-header ${
										colIndex - 1 === new Date().getDay() ? "today" : ""
									}`}
									sx={{
										gridColumn: `${colIndex + 1}`,
										gridRow: 1,
										borderRadius: colIndex === 7 ? "0 8px 0 0" : 0,
										padding: "6px 0",
										borderBottom: "1px solid black",
									}}
								>
									<Typography
										variant="body2"
										sx={{ fontSize: "14px", fontWeight: "bold" }}
									>
										{col.label}
									</Typography>
								</Box>
							);

						// Row Labels - 1st column
						if (colIndex === 0)
							return (
								<Box
									key={`${colIndex}-${rowIndex}`}
									className="flex-center row-label"
									sx={{
										gridColumn: 1,
										gridRow: `${rowIndex + 1}`,
										borderRadius:
											rowIndex === rows.length - 1 ? "0 0 0 8px" : 0,
										flexShrink: 1,
										textAlign: "center",
										padding: "6px 0",
										whiteSpace: "wrap",
										borderBottom: "none",
									}}
								>
									<Typography
										variant="body2"
										sx={{ fontSize: "10px", fontWeight: "bold" }}
									>
										{row.label}
									</Typography>
								</Box>
							);

						// Task Data
						const gridTasks = tasks
							.filter((task) => {
								const taskDate = new Date(task.dateTime);
								const rowHour = new Date(row.date).getHours();
								if (rowIndex === 1 && taskDate.getDay() === colIndex - 1)
									return task.allDay;
								return (
									!task.allDay &&
									taskDate.getHours() === rowHour &&
									taskDate.getDay() === colIndex - 1
								);
							})
							.sort(
								(a, b) =>
									new Date(a.dateTime).getMinutes() -
									new Date(b.dateTime).getMinutes()
							);

						const taskExists = !!gridTasks.length;

						// All Day row - row 2
						// if (rowIndex === 1) {
						// 	return (
						// 		<Box
						// 			key={`${colIndex}-${rowIndex}`}
						// 			sx={{
						// 				gridRow: "2",
						// 				gridColumn: " 2 /-1",
						// 				borderRadius: "8px",
						// 				bgcolor: "primary.light",
						// 			}}
						// 		></Box>
						// 	);
						// }
						return (
							<Box
								className={`flex-center col gap2 grid-item ${
									colIndex - 1 === new Date().getDay() ? "today" : ""
								}  ${rowIndex === rows.length - 1 ? "last-row-item" : ""}`}
								key={`${colIndex}-${rowIndex}`}
								sx={{
									whiteSpace: "nowrap",
									textOverflow: "ellipsis",
									width: "100%",
									minWidth: "0",
									height: "100%",
									gridColumn: `${colIndex + 1}`,
									gridRow: `${rowIndex + 1}`,
									padding: "3px 2px",
									//borderTop: taskExists ? "1px solid black" : "none",
									//borderBottom: taskExists ? "1px solid black" : "none",
								}}
							>
								<Box
									className="flex-center col gap2"
									sx={{
										borderRadius: "8px",
										overflow: "hidden",
										borderRight: "1px solid rgba(0, 0, 0, 0.1)",
										borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
										//background: taskExists ? "white" : "rgba(0, 0, 0, 0.05)",
										bgcolor: taskExists
											? isLight
												? theme.palette.background.paper
												: theme.palette.grey[400]
											: isLight
											? theme.palette.grey[300]
											: theme.palette.background.paper,

										transition: "background 0.2s ease-in-out",
										"&:hover": {
											background: taskExists ? "" : "rgba(0, 0, 0, 0.1)",
											cursor: "pointer",
										},
										textAlign: "center",
										width: "100%",
										height: "100%",
										padding: "10px 2px",
									}}
								>
									{gridTasks.map((task, i, arr) => {
										return (
											<Box
												key={task.id}
												className="flex-center col full-w full-h"
												sx={{}}
											>
												{new Date(task.dateTime).getMinutes() !== 0 &&
													new Date(
														arr[Math.max(0, i - 1)].dateTime
													).getMinutes() !==
														new Date(task.dateTime).getMinutes() && (
														<Typography
															variant="body2"
															sx={{
																fontSize: "10px",
																width: "100%",
															}}
														>
															{dayjs(task.dateTime).format("HH:mm")}
														</Typography>
													)}
												<Typography
													variant="body2"
													sx={{
														fontSize: "11px",
														whiteSpace: "nowrap",
														overflow: "hidden",
														textAlign: "center",
														display: "block",
														width: "95%",
														bgcolor: isLight
															? theme.palette.grey[200]
															: theme.palette.background.default,
														border: "1px solid rgba(0, 123, 255, 0.3)",
														borderRadius: "6px",
														padding: "1px 2px",
														boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
														"&:hover": {
															backgroundColor: "rgba(0, 123, 255, 0.2)",
															cursor: "pointer",
															transform: "scale(1.05)",
														},
														height: "21px",
														color: "primary.main",
														fontWeight: "bold",
													}}
												>
													{task.title}
												</Typography>
											</Box>
										);
									})}
								</Box>
							</Box>
						);
					});
				})}
			</Box>
		</Box>
	);
};

export default GoodCalendar;
