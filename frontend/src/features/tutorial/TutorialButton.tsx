import { HelpOutline } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { openModal } from "../modal/modalSlice";

export const TUTORIAL_SECTIONS = {
	overview: "overview",
	stats: "stats",
	habits: "habits",
	timers: "timers",
	weightTracker: "weightTracker",
	calorieCounter: "calorieCounter",
	calendar: "calendar",
	testData: "testData",
} as const;

export type TutorialSection =
	(typeof TUTORIAL_SECTIONS)[keyof typeof TUTORIAL_SECTIONS];

interface TutorialButtonProps {
	section: TutorialSection;
	text?: string;
}

const TutorialButton = ({ section, text }: TutorialButtonProps) => {
	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(
			openModal({
				component: "tutorial",
				props: { section },
				fullScreen: false,
			}),
		);
	};

	return (
		<>
			{text ? (
				<Button
					onClick={handleClick}
					size="small"
					startIcon={<HelpOutline fontSize="small" />}
				>
					{text}
				</Button>
			) : (
				<IconButton
					onClick={handleClick}
					size="small"
					aria-label="Open tutorial"
				>
					<HelpOutline fontSize="small" />
				</IconButton>
			)}
		</>
	);
};

export default TutorialButton;
