import { ArrowBack, CloseOutlined } from "@mui/icons-material";
import {
	Box,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import useDisplay from "../../hooks/useDisplay";
import { closeModal } from "../modal/modalSlice";
import TutorialContent from "./TutorialContent";

type TutorialSectionId =
	| "overview"
	| "stats"
	| "habits"
	| "timers"
	| "weightTracker"
	| "calorieCounter"
	| "calendar"
	| "testData";

const SECTIONS: Array<{ id: TutorialSectionId; label: string }> = [
	{ id: "overview", label: "Overview" },
	{ id: "stats", label: "Stats" },
	{ id: "habits", label: "Habits" },
	{ id: "timers", label: "Timers" },
	{ id: "weightTracker", label: "Weight Tracker" },
	{ id: "calorieCounter", label: "Calorie Counter" },
	{ id: "calendar", label: "Calendar" },
	{ id: "testData", label: "Test Data" },
];

const isSectionId = (value: string): value is TutorialSectionId =>
	SECTIONS.some((s) => s.id === value);

interface TutorialProps {
	section?: string;
}

const Tutorial = ({ section }: TutorialProps) => {
	const dispatch = useDispatch();
	const { isDesktop, isMobile } = useDisplay();

	const initialSection: TutorialSectionId = useMemo(() => {
		if (section && isSectionId(section)) return section;
		return "overview";
	}, [section]);

	const [selectedSection, setSelectedSection] =
		useState<TutorialSectionId>(initialSection);

	const [showMenu, setShowMenu] = useState<boolean>(() => {
		if (!isMobile) return true;
		return section ? false : true;
	});

	const handleSelect = (id: TutorialSectionId) => {
		setSelectedSection(id);
		if (isMobile) setShowMenu(false);
	};

	const handleClose = () => {
		dispatch(closeModal());
	};

	const HeaderRightClose = (
		<IconButton
			onClick={handleClose}
			sx={{ position: "absolute", top: 6, right: 6, zIndex: 2 }}
			aria-label="Close tutorial"
		>
			<CloseOutlined />
		</IconButton>
	);

	const Menu = (
		<Box
			sx={{
				// width: "1",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<Typography sx={{ px: 2, pt: 2, pb: 1 }} variant="h6">
				Tutorial
			</Typography>
			<List sx={{ p: 0, overflow: "auto" }}>
				{SECTIONS.map((s) => {
					const selected = s.id === selectedSection;
					return (
						<ListItemButton
							key={s.id}
							onClick={() => handleSelect(s.id)}
							selected={selected}
							sx={{
								...(selected ? { bgcolor: "primary.main" } : {}),
								...(selected ? { "&:hover": { bgcolor: "primary.main" } } : {}),
							}}
						>
							<ListItemText
								primary={s.label}
								slotProps={{
									primary: {
										sx: selected ? { color: "primary.main" } : {},
									},
								}}
							/>
						</ListItemButton>
					);
				})}
			</List>
		</Box>
	);

	const Content = (
		<Box
			sx={{
				minWidth: isDesktop ? "400px" : "280px",
				width: "100%",
				height: "100%",
				overflowY: "auto",
				p: 1,
				minHeight: 0,
			}}
		>
			<TutorialContent section={selectedSection} />
		</Box>
	);

	// Desktop: always show menu + scrollable content.
	if (isDesktop) {
		return (
			<Box
				sx={{
					position: "relative",
					height: "90dvh",
					width: "100%",
					maxWidth: "700px",
					maxHeight: "90dvh",
					minHeight: 0,
					display: "flex",
				}}
			>
				{HeaderRightClose}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "200px 1fr",
						height: "100%",
						width: "100%",
						minHeight: 0,
					}}
				>
					<Box
						sx={{
							borderRight: "1px solid",
							borderColor: "divider",
							overflowY: "auto",
							minHeight: 0,
						}}
					>
						{Menu}
					</Box>
					{Content}
				</Box>
			</Box>
		);
	}

	// Mobile: menu by default; content view with back arrow.
	return (
		<Box sx={{ position: "relative", height: "90dvh", width: "90vw" }}>
			{HeaderRightClose}
			{showMenu ? (
				<Box sx={{ pt: 1 }}>{Menu}</Box>
			) : (
				<Box
					sx={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							p: 1,
						}}
					>
						<IconButton
							onClick={() => setShowMenu(true)}
							aria-label="Back to sections"
						>
							<ArrowBack />
						</IconButton>
						<Typography variant="body1" sx={{ fontWeight: "bold" }}>
							Tutorial
						</Typography>
					</Box>
					{Content}
				</Box>
			)}
		</Box>
	);
};

export default Tutorial;
