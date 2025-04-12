import { Home, ManageAccounts, Task } from "@mui/icons-material";
import {
	BottomNavigation,
	BottomNavigationAction,
	Box,
	Toolbar,
	Typography,
} from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import { SyntheticEvent, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const navStyle = {
	color: "primary.contrastText",
	bgColor: "primary.main",
	width: "100%",
};

const topNav = {
	...navStyle,
	display: "grid",
	gridTemplateColumns: "1fr 2fr 1fr",
	justifyContent: "center",
};

type Props = {
	isMobile: boolean;
};

const Nav = {
	home: "/",
	habits: "/habits",
	add: "/add",
	account: "/account",
	calendar: "/calendar",
} as const;

type NavType = (typeof Nav)[keyof typeof Nav];

const NavBar: React.FC<Props> = ({ isMobile = true }) => {
	const [value, setValue] = useState<NavType | "">("");
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const match = Object.values(Nav).find((val) => val === location.pathname);
		if (match) {
			setValue(match as NavType);
		} else {
			setValue("");
		}
	}, [location]);

	const handleChange = (e: SyntheticEvent, newValue: NavType) => {
		setValue(newValue);
		navigate(newValue);
	};

	return (
		<Box sx={{ width: "100%" }}>
			{!isMobile && (
				<Toolbar sx={topNav}>
					<Typography variant="h6">Better Habits</Typography>
					<Toolbar sx={{ justifyContent: "space-around" }}>
						<NavLink to={Nav.home}>Home</NavLink>
						<NavLink to={Nav.habits}>Habits</NavLink>
						<NavLink to={Nav.calendar}>Calendar</NavLink>
					</Toolbar>
					<Box sx={{ justifySelf: "end" }}>
						<ManageAccounts
							onClick={(e) => handleChange(e, Nav.account)}
							sx={{ cursor: "pointer" }}
						/>
					</Box>
				</Toolbar>
			)}
			{isMobile && (
				<BottomNavigation value={value} onChange={handleChange}>
					<BottomNavigationAction
						label="Home"
						value={Nav.home}
						icon={<Home />}
					/>
					<BottomNavigationAction
						label="Habits"
						value={Nav.habits}
						icon={<Task />}
					/>
					<BottomNavigationAction
						label="Calendar"
						value={Nav.calendar}
						icon={<CalendarIcon />}
					/>
					<BottomNavigationAction
						label="Account"
						value={Nav.account}
						icon={<ManageAccounts />}
					/>
				</BottomNavigation>
			)}
		</Box>
	);
};

export default NavBar;
