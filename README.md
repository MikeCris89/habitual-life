# Habitual Life

A habit tracking progressive web app built with React and TypeScript. Designed with a local-first architecture and structured for future migration to a backend with authentication.

**Live:** [https://habitual-life.web.app]

## Features

- Daily task generation based on configurable habits
- Good habits (to-do) and bad habits (not-to-do) tracking
- Completion rate tracking over a rolling 30-day window with a configurable goal
- Single and round interval timers for workouts and breathing exercises
- Weight tracking with historical graph
- Calorie and macro tracking with saved ingredients, meals, and custom entries
- Past day navigation with full edit support
- PWA — installable on mobile and desktop, works offline

## Stack

- React 18, TypeScript
- Redux Toolkit + RTK Query (used as data abstraction layer over IndexedDB)
- IndexedDB via idb for local persistence
- Material UI
- Recharts
- Framer Motion
- Day.js

## Architecture

The app is intentionally structured as if it were a production application backed by a real API.

RTK Query manages all data fetching and cache updates despite the data layer being local. This keeps the components decoupled from the persistence layer and makes a future migration to a REST or GraphQL API straightforward — only the `queryFn` implementations would need to change.

Data is scoped per user via a `userId` stored in metadata, anticipating future JWT-based authentication.

Daily tasks are generated programmatically on app load based on habit definitions rather than being stored statically, reducing data duplication and aligning with how a server-side cron job would work.

## Running Locally

```bash
npm install
npm start
```
