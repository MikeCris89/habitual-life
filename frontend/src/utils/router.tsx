import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from "react-router-dom";
import Habits from "../pages/Habits";
import Root from "../pages/Root";
import Home from "../pages/Home";
import HabitForm from "../features/habits/HabitForm";
import HabitDetails from "../features/habits/HabitDetails";

const routes = createRoutesFromElements(
	<Route path="/" element={<Root />}>
		<Route index element={<Home />} />
		<Route path="habits" element={<Habits />}>
			<Route path="add/:type" element={<HabitForm />} />

			<Route path=":id" element={<HabitDetails />} />
			<Route path=":id/edit" element={<HabitForm />} />
		</Route>
	</Route>
);

const router = createBrowserRouter(routes);

export default router;
