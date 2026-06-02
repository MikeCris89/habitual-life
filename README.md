# Habitual Life

A mobile-first habit tracking PWA built with React 18 + TypeScript. Build good habits and break bad ones, track completion rates over time, log calories and macros with saved ingredients and reusable meals, and use built-in timers for workouts and breathing exercises. Everything runs locally on the device and works offline.

I built this because I wanted a single customizable app for all my habits, and it ended up being my first fully finished and deployed project. The architecture is the part I'm most proud of — RTK Query abstracting over IndexedDB so the whole app is ready for a backend migration without changing a single component.

**Live:** [https://habitual-life.web.app](https://habitual-life.web.app)

---

## Features

- Good habit / bad habit tracking with separate tabs
- Daily tasks generated programmatically from habit definitions on app load
- Past day navigation with full edit support on historical tasks
- Completion rate tracking over a rolling 30-day window with configurable goal
- Single countdown timer and round-interval timer (work/rest cycles for workouts, breathing)
- Stats page with completion rate charts (Recharts)
- Weekly calendar overview
- Preset habits for weight tracking and calorie/macro counting with saved ingredients
- Tutorial system, auto-shown on first load and accessible throughout the app
- Test data generator for populating realistic history
- Account settings with full data reset
- Installable PWA, works offline

---

## How Daily Tasks Are Generated

Habits are definitions. Tasks are what the user actually interacts with each day. The app doesn't store a year's worth of tasks up front. On each app load (and on tab refocus), `DataLoader` compares today's date against `lastCreatedDate` in metadata. If they don't match, it builds tasks for every habit scheduled for today and writes them to IndexedDB. The metadata cache is updated optimistically to prevent a race condition where the visibility check re-fires before the write confirms.

---

## RTK Query Over IndexedDB

This is the core architectural decision in the app. Every piece of data (habits, tasks, metadata) flows through RTK Query endpoints with `queryFn` implementations that read/write to IndexedDB via the `idb` library. Components never import `idb` directly. They use hooks like `useGetHabitsQuery()` and `useUpdateTaskMutation()`, the same way they would with a REST API.

```ts
// habitsApi.ts
getHabits: builder.query<Habit[], void>({
  queryFn: async () => {
    try {
      const data = (await dbActions.getAll("habits")) ?? [];
      return { data };
    } catch (error) {
      return {
        error: {
          status: "Custom_Error",
          message: "Failed to fetch habits.",
        },
      };
    }
  },
  keepUnusedDataFor: 12 * 60 * 60,
  providesTags: ["Habits"],
}),
```

The benefit is that migrating to a real backend means replacing `queryFn` bodies with `fetch` calls. The hooks, cache tags, optimistic updates, and component code all stay the same. It also means the app gets RTK Query's cache invalidation, loading/error states, and subscription tracking for free, even though the data is local.

---

## How Stats Work

The stats page calculates completion rates over a rolling 30-day window. It counts completed tasks versus total tasks per day, then charts that as a percentage over time.

### A Known Limitation

Stats only count tasks that were actually created, and tasks are only created on days the app was opened. The completion rate only reflects days where the app was opened and tasks were generated.

Fixing this would mean retroactively generating tasks for missed days and teaching the stats logic about habit scheduling rules. Doable, but out of scope for the MVP.

---

## Timers

Two timer types, both managed through a `timerSlice` in Redux:

- **Single timer** — a straightforward countdown. Set a duration, start it, get notified when it hits zero. Used for timed habits like reading or meditation.
- **Round-interval timer** — configurable work/rest rounds. Set the number of rounds, work duration, and rest duration. The timer alternates between phases and tracks which round you're on. Built for workouts and breathing exercises.

---

## Calorie Counter

The calorie counter is a full sub-feature inside the app. Users set a daily calorie goal and optionally choose which macros to track (protein, carbs, fat) with individual targets.

There are three tabs for logging food:

- **Ingredients** — a saved library of individual foods with calories, macros, and quantity (by weight or units). These persist in IndexedDB and can be reused across meals.
- **Meals** — built from saved ingredients or entered with custom values. Also saved to IndexedDB for quick re-logging.
- **Custom** — one-off entries without saving anything.

The basket shows everything logged for the day. Adding items updates the calorie total and macro gauges in real time. The gauges show progress against each macro's daily target and flag when you're over.

One design decision worth noting: the basket itself is not persisted to IndexedDB. Only the calorie tracking task is saved, and it marks as complete if the user logged at least one item and stayed under their calorie goal. Macros are displayed but don't affect task completion.

Meals store ingredient IDs, not full copies of ingredient data, so calories and macros are calculated dynamically. This means updating an ingredient automatically updates every meal that uses it. For custom entries where the user just types the macros directly (like a restaurant meal), a hidden "Quick Add" ingredient is created behind the scenes so the data model stays consistent without special-case logic.

---

## App Bootstrap

The app loads through a specific chain:

```
index.tsx → App.tsx → Root.tsx → DataLoader + Navbar + Outlet
```

`DataLoader` is wrapped in an `ErrorBoundary`, but `Navbar` is not. This way, if data loading fails, the user still sees the nav bar and gets an error message instead of a blank screen.

`DataLoader` handles three things on mount:

1. Fetches metadata (creates it if this is a first launch, generating a `userId` via `nanoid`)
2. Fetches all habits and tasks
3. Runs `createDailyTasks` if needed

`useVisibilityEffect` re-triggers step 3 when the tab regains focus, so a user who leaves the app open overnight gets today's tasks when they come back.

---

## Test Data Generator

The generator populates realistic historical task data for existing habits, so the stats page has something to show without manually completing tasks over days and weeks. Useful for development, testing, and demos.

---

## Testing

Tests cover the core logic:

- **`generateTasks`** (4 tests) — task creation for all-day vs time-of-day habits, skips non-scheduled days, correct output over a full week
- **`statsSlice`** (3 tests) — total/completed task counts, per-day completion rate calculation, day stats initialization
- **`timerSlice`** (6 tests) — single timer completion, break phase after round, round advancement, full set/round cycle completion, play/pause toggle, restart behavior

Tests use Jest (via Create React App). Mock data properties are referenced directly in assertions (`mockHabit.id`) instead of hardcoded strings, and `forEach` with individual `expect` calls is preferred over `.every()` for clearer failure messages.

A `startOfDay()` utility handles date comparisons in tests to avoid timezone issues that come up with hardcoded UTC strings.

---

## Project Structure

```
frontend/
├── public/                # PWA manifest, icons
└── src/
    ├── __tests__/         # Jest test suites
    ├── app/               # Redux store config
    ├── assets/            # Static assets
    ├── components/        # Shared UI (Navbar, ErrorBoundary, DataLoader)
    ├── data/              # Test data generator, mock data
    ├── features/
    │   ├── calendar/      # Weekly calendar overview
    │   ├── calories/      # Calorie & macro tracking
    │   ├── habits/        # Habit CRUD, RTK Query endpoints
    │   ├── loading/       # Loading states
    │   ├── meta/          # Metadata API, theme, tutorial state
    │   ├── modal/         # Modal system
    │   ├── stats/         # Completion rate calculations
    │   ├── tasks/         # Task generation, RTK Query endpoints
    │   ├── timer/         # Single + round-interval timer slice
    │   ├── tutorial/      # Tutorial system
    │   └── weight/        # Weight tracking
    ├── hooks/             # Custom hooks (useVisibilityEffect, etc.)
    ├── pages/             # Route-level components
    └── utils/             # IndexedDB wrapper, date helpers
```

---

## Stack

| Layer       | Technology                        |
| ----------- | --------------------------------- |
| UI          | React 18, TypeScript, Material UI |
| State/Data  | Redux Toolkit, RTK Query          |
| Persistence | IndexedDB via `idb`               |
| Charts      | Recharts                          |
| Animation   | Framer Motion                     |
| Routing     | react-router-dom                  |
| Dates       | Day.js                            |
| IDs         | nanoid                            |
| Errors      | react-error-boundary              |
| Hosting     | Firebase                          |

---

## Running Locally

```bash
cd frontend
npm install
npm start        # CRA dev server on port 3000
```

| Command         | Description            |
| --------------- | ---------------------- |
| `npm start`     | Start dev server       |
| `npm run build` | Production build       |
| `npm test`      | Run Jest in watch mode |

---

## Author

**Michael Cristofaro**

- [LinkedIn](https://www.linkedin.com/in/michael-cristofaro-a4695740a)
- [Email](mailto:mikecris89@icloud.com)
