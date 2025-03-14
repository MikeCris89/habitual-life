import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from "react-router-dom";
// import Habits from "../pages/Habits";
import Root from "../pages/Root";
import { lazy } from "react";
import Home from "../pages/Home";
import CalorieForm from "../features/calories/CalorieForm";
import CalorieLog from "../features/calories/CalorieLog";
// import HabitForm from "../features/habits/HabitForm";
// import HabitDetails from "../features/habits/HabitDetails";
// import Calendar from "../pages/Calendar";
// import Account from "../pages/Account";

const Habits = lazy(() => import("../pages/Habits"));
const HabitForm = lazy(() => import("../features/habits/HabitForm"));
const HabitDetails = lazy(() => import("../features/habits/HabitDetails"));
const Calendar = lazy(() => import("../pages/Calendar"));
const Account = lazy(() => import("../pages/Account"));

const routes = createRoutesFromElements(
	<Route path="/" element={<Root />}>
		<Route index element={<Home />} />
		<Route path="habits" element={<Habits />}></Route>

		<Route path="add/preset_calories" element={<CalorieForm />} />
		<Route path="preset_calories/edit" element={<CalorieForm />} />
		<Route path="preset_calories/log" element={<CalorieLog />} />

		<Route path="add/:type" element={<HabitForm />} />

		<Route path=":id" element={<HabitDetails />} />
		<Route path=":id/edit" element={<HabitForm />} />

		<Route path="calendar" element={<Calendar />} />
		<Route path="account" element={<Account />} />
	</Route>
);

const router = createBrowserRouter(routes);

export default router;
