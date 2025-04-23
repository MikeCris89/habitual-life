import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	useNavigate,
} from "react-router-dom";
import Root from "../pages/Root";
import { lazy } from "react";
import Home from "../pages/Home";
import CalorieForm from "../features/calories/CalorieForm";
import CalorieLog from "../features/calories/CalorieLog";
import NutritionDisplay from "../features/calories/NutritionDisplay";
import MealLog from "../features/calories/MealLog";
import IngredientLog from "../features/calories/IngredientLog";
import FoodModal from "../features/modal/FoodModal";
import { Box, Button } from "@mui/material";
import { PresetId } from "./types";
import WeightTracker from "../features/weight/WeightTracker";
import Stats from "../features/stats/Stats";

const Habits = lazy(() => import("../pages/Habits"));
const HabitForm = lazy(() => import("../features/habits/HabitForm"));
const HabitDetails = lazy(() => import("../features/habits/HabitDetails"));
const Calendar = lazy(() => import("../pages/Calendar"));
const Account = lazy(() => import("../pages/Account"));

const IngredientForm = () => {
	const navigate = useNavigate();
	return (
		<Box className="flex-center col gap2 full-w full-h">
			<Box className="flex full-w" sx={{ justifyContent: "flex-end" }}>
				<Button onClick={() => navigate(-1)}>close</Button>
			</Box>
			<IngredientLog onSubmit={() => navigate(-1)} />
		</Box>
	);
};

const routes = createRoutesFromElements(
	<Route path="/" element={<Root />}>
		<Route index element={<Home />} />
		<Route path="habits" element={<Habits />}></Route>

		<Route path={`add/${PresetId.calorieCounter}`} element={<CalorieForm />} />
		<Route path={`${PresetId.calorieCounter}/edit`} element={<CalorieForm />} />
		<Route
			path={`${PresetId.calorieCounter}/log`}
			element={
				<CalorieLog>
					<NutritionDisplay />
				</CalorieLog>
			}
		>
			<Route
				path="meals/:id?"
				element={
					<FoodModal>
						<MealLog />
					</FoodModal>
				}
			/>
			<Route
				path="ingredients/:id?"
				element={
					<FoodModal>
						<IngredientForm />
					</FoodModal>
				}
			/>
		</Route>
		<Route path={`${PresetId.weightTracker}/log`} element={<WeightTracker />} />

		<Route path={`stats`} element={<Stats />} />

		<Route path="add/:type" element={<HabitForm />} />

		<Route path=":id" element={<HabitDetails />} />
		<Route path=":id/edit" element={<HabitForm />} />

		<Route path="calendar" element={<Calendar />} />
		<Route path="account" element={<Account />} />
	</Route>
);

const router = createBrowserRouter(routes);

export default router;
