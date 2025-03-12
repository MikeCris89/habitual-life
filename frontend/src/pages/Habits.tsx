import { Box, Paper, TextField, Typography } from "@mui/material";
import HabitCard from "../features/habits/HabitCard";
import { Habit } from "../utils/types";
import useDisplay from "../hooks/useDisplay";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Close, Search } from "@mui/icons-material";
import { memo, useState } from "react";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import AddButton from "../components/AddButton";

interface ListProps {
	habits?: Habit[];
	search?: string;
}

const HabitsList = memo(({ search }: ListProps) => {
	let { data: habits } = useGetHabitsQuery();

	if (habits && search)
		habits = habits.filter((habit) =>
			habit.title.toLowerCase().includes(search.toLowerCase())
		);

	return (
		<Box className="flex-center col gap2">
			{habits?.map((habit: Habit) => (
				<Box key={habit.id} sx={{ width: "100%" }}>
					<HabitCard habit={habit} />
				</Box>
			))}
		</Box>
	);
});

interface BarProps {
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const HabitBar = memo(({ search, setSearch }: BarProps) => (
	<Paper
		className="flex-between"
		sx={{
			width: "100%",
			position: "sticky",
			top: 0,
			zIndex: 1,
			p: 1,
			backgroundColor: "#e7e7e7",
			marginBottom: "10px",
		}}
	>
		<Box className="flex-center gap2">
			<Search />
			<TextField
				type="text"
				size="small"
				label="search..."
				onChange={(e) => setSearch(e.target.value)}
				value={search}
				sx={{
					p: 0,
					m: 0,
					fontSize: "12px",
					"& .MuiOutlinedInput-root": {
						padding: 0,
					},
					"& .MuiInputBase-input": { fontSize: "12px", p: 1 },
					"& label": { fontSize: "12px" },
				}}
			/>
			{search && <Close fontSize="small" onClick={() => setSearch("")} />}
		</Box>
		<AddButton />
	</Paper>
));

const Habits = () => {
	const [search, setSearch] = useState<string>("");
	const { id, type } = useParams();
	const location = useLocation();
	const { isMobile } = useDisplay();

	const isAdd = location.pathname.includes("/add") && type;
	const isEdit = location.pathname.includes("/edit") && id;
	const isView = !isEdit && id;

	const isOutlet = isAdd || isEdit || isView;

	return (
		<Box
			className="flex col"
			sx={{ overflow: "hidden", height: "100%", width: "100%" }}
		>
			<Box sx={{ flex: 1, width: "100%", minHeight: 0 }}>
				{/* Mobile - full page  */}
				{isMobile && (
					<Box
						sx={{
							height: "100%",
							maxWidth: "600px",
							margin: "auto",
						}}
					>
						{!isOutlet && (
							<Box
								sx={{
									minHeight: 0,
									position: "relative",
									height: "100%",
									overflowY: "auto",
								}}
							>
								<HabitBar search={search} setSearch={setSearch} />
								<HabitsList search={search} />
							</Box>
						)}

						{isOutlet && <Outlet />}
					</Box>
				)}
				{/*  Desktop - side by side */}
				{!isMobile && (
					<Box
						className="flex-center col"
						sx={{
							height: "100%",
							width: "100%",
						}}
					>
						<Box
							className="flex gap2"
							sx={{
								flex: 1,
								width: "100%",
								overflow: "hidden",
							}}
						>
							<Box
								sx={{
									maxWidth: "600px",
									height: "100%",
									overflow: "auto",
									position: "relative",
								}}
							>
								<HabitBar search={search} setSearch={setSearch} />
								<HabitsList search={search} />
							</Box>

							<Box
								className="flex-center"
								sx={{ flex: 1, height: "100%", alignItems: "start" }}
							>
								{!isOutlet ? (
									<Box sx={{ textAlign: "center", color: "gray" }}>
										<Typography variant="h6">
											Stats Component Coming Soon...
										</Typography>
									</Box>
								) : (
									<Outlet />
								)}
							</Box>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default Habits;
