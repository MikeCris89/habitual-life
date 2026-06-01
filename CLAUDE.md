# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `frontend/`:

```bash
npm start          # dev server
npm run build      # production build
npm test           # run all tests (Jest + React Testing Library)
npm test -- --testPathPattern=generateTasks   # run a single test file
firebase deploy    # deploy to Firebase (requires firebase-tools)
```

No separate lint command — ESLint runs through `react-scripts` (`react-app` + `react-app/jest` presets). No Prettier config.

## Architecture

### Project layout

```
frontend/src/
├── app/store.ts          # Redux store
├── components/           # Shared UI components
├── features/             # Feature slices + RTK Query APIs
│   ├── habits/           # Habit CRUD (habitsApi)
│   ├── tasks/            # Task generation + CRUD (tasksApi)
│   ├── calories/         # Calorie/macro tracking + food (foodApi)
│   │   └── food/         # Ingredient/meal sub-feature
│   ├── meta/             # App metadata — userId, theme, goals (metaApi)
│   ├── stats/            # statsSlice + memoized selectors
│   ├── timer/            # timerSlice
│   ├── loading/          # loadingSlice + LoadingModal
│   ├── modal/            # modalSlice + GlobalModal
│   ├── calendar/
│   ├── weight/
│   └── tutorial/
├── pages/                # Routed page components (lazy-loaded)
├── hooks/                # Custom hooks (ThemeProvider, useDisplay, etc.)
├── utils/
│   ├── indexedDb.ts      # All IndexedDB read/write operations (idb)
│   ├── router.tsx        # React Router v7 config
│   ├── types.ts          # Shared TypeScript types
│   └── timeUtils.ts      # Day.js helpers
└── data/                 # Static ingredient JSON files
```

### Data layer: RTK Query over IndexedDB

All four APIs (`habitsApi`, `tasksApi`, `metaApi`, `foodApi`) use `fakeBaseQuery` — there is no HTTP backend. Every `queryFn` calls into `utils/indexedDb.ts` directly. This mirrors a REST API shape so that a future backend migration only touches the `queryFn` bodies, not any component or cache logic.

IndexedDB stores: `habits`, `tasks` (indexed by `habitId` and `dateTime`), `meta`, `baskets`, `ingredients`, `meals`, `errorLogs`.

### Daily task generation

`components/DataLoader.tsx` runs on app load and whenever the tab regains visibility (`useVisibilityEffect`). It reads `meta.lastCreatedDate` and, if it doesn't match today, calls the `createDailyTasks` mutation in `tasksApi`. The generator in `tasksApi` iterates habit definitions, filters by day-of-week, and batch-inserts tasks into IndexedDB — no tasks are stored ahead of time.

### Routing

React Router v7 with lazy-loaded pages. The root layout is `pages/Root.tsx`. Preset habit features (calories, weight) have dedicated sub-routes (`/preset_calories/log`, `/preset_weight/log`) that render inside modal-style overlays.

### Redux store shape

RTK Query reducers: `habitsApi`, `tasksApi`, `metaApi`, `foodApi`.  
Plain slices: `loading`, `modal`, `stats`, `timer`.

### Tests

Located in `src/__tests__/`. Current coverage: `generateTasks.test.ts`, `statsSlice.test.ts`, `timers.test.ts`. Mocks live in `src/__tests__/mocks/`. Jest transform config excludes `nanoid`, `react-router-dom`, and `@remix-run` from the default ignore pattern (ESM packages).

# Behavioral guidelines

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
