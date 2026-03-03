import { Box } from "@mui/material";
import PageNav from "../../components/PageNav";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useEditTaskMutation, useGetDailyTasksQuery } from "../tasks/tasksApi";
import { isCounterTask, MacrosTask, PresetId } from "../../utils/types";
import { handleError } from "../../utils/errors";
import { useSelector } from "react-redux";
import { selectBasketTotals } from "./basketsSelectors";
import { nanoid } from "nanoid";
import useDisplay from "../../hooks/useDisplay";
import { Outlet } from "react-router-dom";
import NutritionInput from "./NutritionInput";
import { TUTORIAL_SECTIONS } from "../tutorial/TutorialButton";

export const CurrBasketIdContext = createContext<string | undefined>(undefined);

export const useCurrBasketId = () => {
	const value = useContext(CurrBasketIdContext);
	if (value == null) {
		handleError(
			"Current Basket ID is null. useCurrBasketId hook must be used within Calorie Log component.",
		);
	}
	return value;
};

interface CalorieProps {
	children: React.ReactNode;
}

const CalorieLog = ({ children }: CalorieProps) => {
	const currentBasketId = useMemo(() => nanoid(), []);

	const { allBasketsTotal } = useSelector(selectBasketTotals);

	const [editTask] = useEditTaskMutation();

	const { data: task } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [], isLoading }) => {
			const result = data.find((el) => el.habitId === PresetId.calorieCounter);
			if (result && !isCounterTask(result)) {
				handleError("Calorie task is not counter.");
			}
			return { data: result, isLoading };
		},
	});

	const { isMobile } = useDisplay();

	useEffect(() => {
		if (!task || !task.macros || !allBasketsTotal) return;

		const caloriesChanged = task.count !== allBasketsTotal.calories;
		const macrosChanged = task.macros.some(
			(mac) => mac.count !== allBasketsTotal.macros[mac.id],
		);

		if (caloriesChanged || macrosChanged) {
			editTask({
				...task,
				count: allBasketsTotal.calories,
				macros: task.macros?.map((mac: MacrosTask) => {
					const newMacAmount = allBasketsTotal.macros[mac.id];
					if (newMacAmount == null)
						handleError(`Cannot find macro element in macros state. ${mac.id}`);

					return {
						...mac,
						count: newMacAmount,
					};
				}),
				complete: allBasketsTotal.calories > task.total ? false : true,
			});
		}
	}, [allBasketsTotal, task, editTask]);

	return (
		<Box
			className="flex-between col gap2 full-w full-h"
			sx={{
				p: 1,
				overflow: "hidden",

				"& >*": { width: "100%" },
			}}
		>
			<CurrBasketIdContext.Provider value={currentBasketId}>
				<PageNav
					back={true}
					title="Calorie Counter"
					tutorialSection={TUTORIAL_SECTIONS.calorieCounter}
				/>

				<Outlet />

				<Box
					className="flex-center gap2 full-h full-w"
					sx={{
						flexDirection: isMobile ? "column" : "row",
					}}
				>
					{/* Current Calorie/Macros Count - NutritionDisplay.tsx */}
					{children}

					{/* Calorie Input */}
					<NutritionInput />
				</Box>
			</CurrBasketIdContext.Provider>
		</Box>
	);
};

export default CalorieLog;
