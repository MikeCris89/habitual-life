import { Box, Tooltip, Typography } from "@mui/material";
import { DayKeys, GoodTask } from "../../utils/types";
import dayjs from "dayjs";
import { startOfWeek } from "../../utils/timeUtils";
import { CalendarIcon } from "@mui/x-date-pickers";

interface Props {
	tasks: GoodTask[];
}

const GoodCalendar = ({ tasks }: Props) => {
	const weekStart = new Date(startOfWeek());
	const columns = [
		...DayKeys.map((day, i) => ({
			label: day.slice(0, 1),
			date: new Date(weekStart.setDate(weekStart.getDate() + i)).toISOString,
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
	const rows = [{ label: "All Day", date: "" }];

	for (let x = min; x <= max; x++) {
		const labelDate = new Date();
		labelDate.setHours(x, 0, 0, 0);
		rows.push({
			label: dayjs(labelDate).format("HH:mm"),
			date: labelDate.toISOString(),
		});
	}

	console.log("good calendar render ");

	return (
		<Box
			sx={{
				height: "100%",
				overflowY: "auto",
				overflowX: "hidden",
				minHeight: 0,
				maxWidth: "100%",
			}}
		>
			<Box
				sx={{
					display: "grid",
					//gridTemplate: `fit-content repeat(${rows.length}, 1fr) / 40px repeat(${columns.length}, 1fr)`,
					gridTemplateColumns: "40px repeat(7, 1fr)",
					gridAutoRows: "minmax(30px, auto)",
					maxWidth: "100%",
					minWidth: 0,
					border: "1px solid black",
					"& > *": {
						borderRight: "1px solid rgba(0, 0, 0, 0.3)",
						borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
						background: "linear-gradient(to bottom, #f8f8f8 50%, #ffffff 50%)",
						backgroundSize: "100% 40px",
					},
				}}
			>
				{/* Empty Box - Top-Left */}
				<Box
					className="flex-center"
					sx={{
						gridColumn: "1",
						gridRow: "1",
						borderRight: "1px solid rgba(0, 0, 0, 0.3)",
						borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
					}}
				>
					<CalendarIcon />
				</Box>
				{/* Column Labels */}
				{columns.map(({ label, date }, i) => (
					<Box
						key={`${date}-${i}`}
						className="flex-center"
						sx={{
							gridRow: "1",
							gridColumn: `${i + 2}`,
							textAlign: "center",
						}}
					>
						<Typography variant="body2" sx={{ fontSize: "12px" }}>
							{label}
						</Typography>
					</Box>
				))}
				{/* Rows Labels */}
				{rows.map(({ label, date }, i) => (
					<Box
						key={`${label}-${i}`}
						className="flex-center"
						sx={{
							gridRow: `${i + 2}`,
							gridColumn: "1",
							textAlign: "center",
						}}
					>
						<Typography variant="body2" sx={{ fontSize: "8px" }}>
							{label}
						</Typography>
					</Box>
				))}
				{/* Task Data */}
				{columns.map((col, colIndex) => {
					return rows.map((row, rowIndex) => {
						return (
							<Box
								key={`${colIndex}-${rowIndex}`}
								className="flex-center col gap1"
								sx={{
									gridColumn: `${colIndex + 2}`,
									gridRow: `${rowIndex + 2}`,
									minHeight: "30px",
									padding: "2px",
									//minWidth: 0,
									overflow: "hidden",
								}}
							>
								{tasks &&
									tasks
										.filter((task) => {
											const taskDate = new Date(task.dateTime);
											const rowDate = new Date(row.date);
											return (
												taskDate.getDay() === colIndex &&
												(rowIndex === 0
													? task.allDay
													: !task.allDay &&
													  taskDate.getHours() === rowDate.getHours())
											);
										})
										.map((task) => (
											<Box
												key={task.id}
												sx={{
													flexShrink: 1,
													textAlign: "center",
													//outline: "1px solid black",
													//borderRadius: "12px",
													//padding: "2px 3px",
													overflow: "hidden",
													whiteSpace: "nowrap",
													textOverflow: "ellipsis",
													maxWidth: "90%",
													minWidth: "0",
												}}
											>
												<Typography
													variant="body2"
													sx={{
														fontSize: "10px",
														whiteSpace: "nowrap",
														overflow: "hidden",
														textOverflow: "ellipsis",
														display: "block",
														maxWidth: "100%",
													}}
												>
													{task.title}
												</Typography>
											</Box>
										))}
							</Box>
						);
					});
				})}
			</Box>
		</Box>
	);
};

export default GoodCalendar;
