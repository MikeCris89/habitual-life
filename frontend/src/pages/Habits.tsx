import {
	Box,
	Button,
	Modal,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import HabitCard from "../features/habits/HabitCard";
import { Habit, HabitType } from "../utils/types";
import useDisplay from "../hooks/useDisplay";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Close, Search } from "@mui/icons-material";
import AddMenu from "../components/AddMenu";
import { memo, useState } from "react";
import { useGetHabitsQuery } from "../features/habits/habitsApi";

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
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const HabitBar = memo(({ search, setSearch, setOpenModal }: BarProps) => (
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
			//m: 1,
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
					//color: "primary.contrastText",
					//"& > *": { backgroundColor: "primary.contrastText" },
					// "& label[data-shrink='true']": {
					// 	border: "1px solid black",
					// 	borderRadius: "4px",
					// },
				}}
			/>
			{search && <Close fontSize="small" onClick={() => setSearch("")} />}
		</Box>
		<Button
			variant="contained"
			// sx={{
			// 	color: "primary.contrastText",
			// 	borderColor: "primary.contrastText",
			// }}
			onClick={() => setOpenModal(true)}
		>
			add
		</Button>
	</Paper>
));

const Habits = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [search, setSearch] = useState<string>("");
	const { id, type } = useParams();
	const location = useLocation();
	const { isMobile } = useDisplay();
	const navigate = useNavigate();

	const handleMenuNav = (type: HabitType) => {
		navigate(`add/${type}`);
		setOpenModal(false);
	};

	const isAdd = location.pathname.includes("/add") && type;
	const isEdit = location.pathname.includes("/edit") && id;
	const isView = !isEdit && id;

	const isOutlet = isAdd || isEdit || isView;

	return (
		<Box
			className="flex col"
			sx={{ overflow: "hidden", height: "100%", width: "100%" }}
		>
			{/** Modal for AddMenu */}

			<Modal
				open={openModal}
				onClose={() => setOpenModal(false)}
				className="flex-center"
			>
				<Paper sx={{ p: 3 }}>
					<AddMenu callback={handleMenuNav} />
				</Paper>
			</Modal>

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
								<HabitBar
									search={search}
									setSearch={setSearch}
									setOpenModal={setOpenModal}
								/>
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
								<HabitBar
									search={search}
									setSearch={setSearch}
									setOpenModal={setOpenModal}
								/>
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
