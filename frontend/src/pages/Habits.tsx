import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import HabitCard from "../components/HabitCard";
import { Habit, HabitType } from "../utils/types";
import PageNav from "../components/PageNav";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import useDisplay from "../hooks/useDisplay";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Search } from "@mui/icons-material";
import AddMenu from "../components/AddMenu";
import { useState } from "react";

type ListProps = {
	habits: Habit[];
};

const HabitsList: React.FC<ListProps> = ({ habits }) => {
	return (
		<Box
			className="flex-center col gap2"
			sx={{
				width: "100%",
			}}
		>
			{habits.map((habit: Habit, i: number) => (
				<Box key={habit.title + i} sx={{ width: "100%" }}>
					<HabitCard habit={habit} />
				</Box>
			))}
		</Box>
	);
};

const Habits: React.FC = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const { id, type } = useParams();
	const location = useLocation();
	const { isMobile } = useDisplay();
	const navigate = useNavigate();

	const habits = useSelector((state: RootState) => state.habits);

	const handleMenuNav = (type: HabitType) => {
		navigate(`add/${type}`);
		setOpenModal(false);
	};

	const isAdd = location.pathname.includes("/add") && type;
	const isEdit = location.pathname.includes("/edit") && id;
	const isView = !isEdit && id;

	const isOutlet = isAdd || isEdit || isView;

	const HabitBar = () => (
		<Paper
			className="flex-between"
			sx={{
				width: "100%",
				position: "sticky",
				top: 0,
				zIndex: 1,
				p: 1,
			}}
		>
			<Search />
			<Button variant="outlined" onClick={() => setOpenModal(true)}>
				add
			</Button>
		</Paper>
	);

	return (
		<Box
			className="flex col"
			sx={{ overflow: "hidden", height: "100%", width: "100%" }}
		>
			<PageNav title="Habits" />

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

			<Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
				{isMobile && (
					<Box
						sx={{
							overflow: "auto",
							height: "100%",
							maxWidth: "600px",
						}}
					>
						{!isOutlet && (
							<Box
								className="flex-center col"
								sx={{ minHeight: "100%", position: "relative" }}
							>
								{/* <Box
									className="flex-between"
									sx={{ width: "100%", position: "sticky" }}
								>
									<Search />
									<Button variant="outlined">add</Button>
								</Box> */}
								<HabitBar />
								<HabitsList habits={habits} />
							</Box>
						)}

						{isOutlet && <Outlet />}
					</Box>
				)}
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
								{/* <Paper
									className="flex-between"
									sx={{
										width: "100%",
										position: "sticky",
										top: 0,
										zIndex: 1,
										p: 1,
									}}
								>
									<Search />
									<Button variant="outlined">add</Button>
								</Paper> */}
								<HabitBar />
								<HabitsList habits={habits} />
							</Box>

							<Paper sx={{ flex: 1, height: "100%" }}>
								{!isOutlet ? (
									<Box sx={{ textAlign: "center", color: "gray" }}>
										<Typography variant="h6">
											Stats Component Coming Soon...
										</Typography>
									</Box>
								) : (
									<Outlet />
								)}
							</Paper>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default Habits;
