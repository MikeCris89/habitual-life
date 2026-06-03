import { Box, Typography } from "@mui/material";
import { TUTORIAL_SECTIONS, TutorialSection } from "./TutorialButton";

const TutorialContent = ({ section }: { section: TutorialSection }) => {
	switch (section) {
		// overview
		case TUTORIAL_SECTIONS.overview:
			return (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 2,
					}}
				>
					<Box
						sx={{
							display: "flex",
							gap: "10px",
							alignItems: "center",
						}}
					>
						<img
							src="favicon-96x96.png"
							alt="habitual-logo"
							height={75}
							width={75}
						/>
						<Typography
							variant="h5"
							sx={{ fontWeight: "bold", textWrap: "balance" }}
						>
							Welcome to Habitual Life
						</Typography>
					</Box>

					<Typography variant="body1">
						Habitual Life is a habit tracking app designed to help you build
						good habits and break bad ones. All your data is stored locally on
						your device — no account required.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						What you can track:
					</Typography>

					<Box
						component="ul"
						sx={{
							pl: 2,
							m: 0,
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}
					>
						<Typography component="li" variant="body2">
							✅ Good habits — daily tasks you want to complete, with optional
							timers for workouts or breathing exercises
						</Typography>
						<Typography component="li" variant="body2">
							🚫 Bad habits — things you want to avoid, tracked in your "Not
							To-Do" list
						</Typography>
						<Typography component="li" variant="body2">
							⚖️ Weight — log your daily weight and visualize your progress over
							time
						</Typography>
						<Typography component="li" variant="body2">
							🍎 Calories & Macros — track your daily nutrition with custom
							ingredients and meals
						</Typography>
					</Box>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						How it works:
					</Typography>

					<Typography variant="body1">
						Every day the app generates your tasks based on the habits you've
						set up. Check them off as you complete them throughout the day. Your
						completion rate is calculated over the last 30 days, so one bad week
						won't define you — it'll fade out naturally as time goes on.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Getting started:
					</Typography>

					<Box
						component="ol"
						sx={{
							pl: 2,
							m: 0,
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}
					>
						<Typography component="li" variant="body2">
							Go to the Habits page and create your first habit
						</Typography>
						<Typography component="li" variant="body2">
							Come back to the Home screen to see your daily tasks
						</Typography>
						<Typography component="li" variant="body2">
							Check off tasks as you complete them throughout the day
						</Typography>
						<Typography component="li" variant="body2">
							Visit Stats to track your progress over time
						</Typography>
					</Box>
				</Box>
			);
		// STATS - COMPLETION RATE
		case TUTORIAL_SECTIONS.stats:
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Typography variant="h5" sx={{ fontWeight: "bold" }}>
						Stats & Completion Rate
					</Typography>

					<Typography variant="body1">
						Your completion rate tracks how consistently you've completed your
						habits over the last 30 days. Old data naturally falls off, so a
						rough week won't haunt you forever.
					</Typography>

					<Typography variant="body1">
						You can set your personal completion target in the Stats page —
						anywhere from 50% to 90%. The goal is to keep everything in the
						green.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Color indicators:
					</Typography>

					<Box
						component="ul"
						sx={{
							pl: 2,
							m: 0,
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}
					>
						<Typography component="li" variant="body2">
							🔵 Blue — you're crushing it, well above your goal
						</Typography>
						<Typography component="li" variant="body2">
							🟢 Green — on track, within your target range
						</Typography>
						<Typography component="li" variant="body2">
							🟡 Yellow — slipping a little, time to refocus
						</Typography>
						<Typography component="li" variant="body2">
							🔴 Red — significantly behind, time to get back on it
						</Typography>
					</Box>

					<Typography variant="body1">
						Each individual habit also has its own completion rate so you can
						see exactly which habits need more attention.
					</Typography>
				</Box>
			);
		case TUTORIAL_SECTIONS.habits:
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Typography variant="h5" sx={{ fontWeight: "bold" }}>
						Habits
					</Typography>

					<Typography variant="body1">
						Habits are the foundation of the app. There are two types — things
						you want to do, and things you want to stop doing.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Good Habits ✅
					</Typography>

					<Typography variant="body1">
						Tasks you want to complete daily. You can set which days of the week
						they apply, and optionally assign specific times of day. A habit set
						to multiple times a day will generate multiple tasks — for example,
						going for a walk at 8am and again at 8pm.
					</Typography>

					<Typography variant="body1">
						Good habits can also have a timer attached — useful for workouts,
						meditation, or breathing exercises. Tap the timer icon on a task to
						start it.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Bad Habits 🚫
					</Typography>

					<Typography variant="body1">
						Things you're trying to avoid — junk food, doom scrolling, whatever
						it is. They live on your "Not To-Do" list and work the same way:
						check it off if you successfully avoided it that day.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Managing Habits
					</Typography>

					<Typography variant="body1">
						Create, edit, or delete habits from the Habits page. Changes take
						effect the same day — your daily tasks will update automatically.
					</Typography>
				</Box>
			);
		case TUTORIAL_SECTIONS.timers:
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Typography variant="h5" sx={{ fontWeight: "bold" }}>
						Timers
					</Typography>

					<Typography variant="body1">
						Good habits can have an optional timer attached — great for
						workouts, meditation, stretching, or breathing exercises.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Single Timer ⏱️
					</Typography>

					<Typography variant="body1">
						A straightforward countdown. Set the duration and tap the timer icon
						on your task to start it. When it finishes you'll get a sound
						notification and the option to mark the task complete.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Round Timer 🥊
					</Typography>

					<Typography variant="body1">
						Built for interval training. Set the number of sets, rounds per set,
						duration per round, and an optional break between rounds. The timer
						will automatically cycle through your rounds and breaks, notifying
						you at each transition.
					</Typography>

					<Typography
						variant="body2"
						sx={{ color: "text.secondary", fontStyle: "italic" }}
					>
						Timers are configured when creating or editing a habit under the
						"Timers" section.
					</Typography>
				</Box>
			);
		case TUTORIAL_SECTIONS.weightTracker:
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Typography variant="h5" sx={{ fontWeight: "bold" }}>
						Weight Tracker ⚖️
					</Typography>

					<Typography variant="body1">
						Track your weight over time and visualize your progress with a
						graph. The weight tracker is a preset habit — set which days of the
						week you want to log your weight and it will show up as a task on
						those days.
					</Typography>

					<Typography variant="body1">
						Tap the task on the home screen to log your weight for that day.
						Your history is displayed as a chart so you can see your trend over
						the last 30 days.
					</Typography>

					<Typography
						variant="body2"
						sx={{ color: "text.secondary", fontStyle: "italic" }}
					>
						To set up weight tracking, go to the Habits page and add the Weight
						Tracker preset.
					</Typography>
				</Box>
			);
		case TUTORIAL_SECTIONS.calorieCounter:
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Typography variant="h5" sx={{ fontWeight: "bold" }}>
						Calorie Counter 🍎
					</Typography>

					<Typography variant="body1">
						Track your daily nutrition including calories and macros. Like the
						weight tracker, the calorie counter is a preset habit — add it from
						the Habits page and set which days you want to track.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Setup
					</Typography>

					<Typography variant="body1">
						When creating the calorie counter habit, choose which macros you
						want to track (protein, carbs, fat, etc.) and set your daily maximum
						for each. The task is considered complete if you've logged at least
						one entry and haven't exceeded your daily limits.
					</Typography>

					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						Logging Food
					</Typography>

					<Box
						component="ul"
						sx={{
							pl: 2,
							m: 0,
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}
					>
						<Typography component="li" variant="body2">
							🥗 <strong>Ingredients</strong> — add individual food items with
							their nutritional info per serving size. Reusable across multiple
							meals.
						</Typography>
						<Typography component="li" variant="body2">
							🍽️ <strong>Meals</strong> — combine ingredients into a meal. Log
							the whole meal at once instead of individual items.
						</Typography>
						<Typography component="li" variant="body2">
							✏️ <strong>Custom</strong> — quickly log calories and macros
							manually without saving an ingredient or meal.
						</Typography>
					</Box>

					<Typography variant="body1">
						Your daily totals update in real time as you log food, showing how
						close you are to your limits for each macro.
					</Typography>

					<Typography
						variant="body2"
						sx={{ color: "text.secondary", fontStyle: "italic" }}
					>
						Tip: Build out your ingredients first, then create meals from them
						for faster daily logging.
					</Typography>
				</Box>
			);
		case TUTORIAL_SECTIONS.calendar:
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Typography variant="h5" sx={{ fontWeight: "bold" }}>
						Calendar 📅
					</Typography>

					<Typography variant="body1">
						The calendar gives you a read-only weekly overview of your habits.
						Use it to see which habits are scheduled for each day of the week at
						a glance.
					</Typography>

					<Typography
						variant="body2"
						sx={{ color: "text.secondary", fontStyle: "italic" }}
					>
						To add or modify habits, head to the Habits page.
					</Typography>
				</Box>
			);
		default:
			return null;
	}
};

export default TutorialContent;
