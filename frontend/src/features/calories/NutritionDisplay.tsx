import { Box, Paper, Typography } from "@mui/material";
import { isCounterTask, PresetId } from "../../utils/types";
import { useGetDailyTasksQuery } from "../tasks/tasksApi";
import { handleError } from "../../utils/errors";
import { useSelector } from "react-redux";
import { selectBasketTotals } from "./basketsSelectors";
import SemiCircleBar from "../../components/SemiCircleBar";
import Loading from "../../components/Loading";
import { useCurrBasketId } from "./CalorieLog";
import useDisplay from "../../hooks/useDisplay";

const NutritionDisplay = () => {
	const currentBasketId = useCurrBasketId();
	const { isMobile } = useDisplay();
	const { basketsTotals, allBasketsTotal } = useSelector(selectBasketTotals);
	const { data: task, isLoading } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [], isLoading }) => {
			const result = data.find((el) => el.habitId === PresetId.calorieCounter);
			if (result && !isCounterTask(result)) {
				handleError("Calorie task is not counter.");
			}
			return { data: result, isLoading };
		},
	});
	const currentTotals = basketsTotals.find((el) => el.id === currentBasketId);

	if (isLoading) {
		return <Loading />;
	} else if (!task) return <Typography>Calorie Task not found.</Typography>;

	return (
		<Paper
			className="flex-center col gap2"
			sx={{
				p: 2,
				minHeight: 0,
				//flex: 1,
				maxHeight: isMobile ? "40%" : "100%",
				width: "100%",
			}}
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
					{currentTotals &&
						currentTotals.calories > 0 &&
						`+${currentTotals.calories}`}
				</Typography>
				<Typography
					variant="h3"
					sx={{
						textAlign: "center",
						color:
							allBasketsTotal.calories > task.total
								? "red"
								: !currentTotals || currentTotals.calories === 0
								? "black"
								: "green",
					}}
				>
					{allBasketsTotal.calories}
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
						const amount = currentTotals?.macros[macro.id] ?? 0;

						return (
							<Box key={macro.id} sx={{ p: 0, m: 0 }}>
								<Typography
									variant="body2"
									sx={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										borderBottom: "1px solid #00000080",
									}}
								>
									{macro.title}
								</Typography>
								<SemiCircleBar
									count={macro.count - amount}
									total={macro.total}
									units={macro.units}
									addAmount={amount}
								/>
							</Box>
						);
					})}
			</Box>
		</Paper>
	);
};

export default NutritionDisplay;
