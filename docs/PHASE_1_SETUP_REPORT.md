# HARghAR Phase 1 Setup Report

## Project structure

Created independent workspaces for `apps/client` (React/TypeScript/Vite customer web), `apps/admin` (React/TypeScript/Vite admin web), `apps/admin-mobile` (Expo Router/React Native/TypeScript), and `server` (Express/TypeScript/Mongoose API), plus root tooling and Windows setup documentation. Each frontend communicates with the same backend API. This report covers foundation and service verification only.

## Technologies

The workspace uses npm workspaces; React 19, Vite, React Router, Tailwind CSS 3, TypeScript, Expo Router, Express 5, Mongoose, dotenv, Zod, cors, Helmet, Morgan, tsx, concurrently, ESLint, and Prettier are declared. Exact resolved versions are recorded in the generated root `package-lock.json`.

## Environment and local database

Required API environment: `MONGODB_URI` (unless explicitly running API-only), with defaults for `PORT=5000` and `NODE_ENV=development`; optional `API_ONLY_MODE` and `CORS_ORIGINS`. Copy `server/.env.example` to `server/.env`. Local URI: `mongodb://127.0.0.1:27017/harghar_dev`.

Web env examples set `VITE_API_BASE_URL=http://localhost:5000`; the Vite development server proxies `/api` to port 5000. Mobile uses `EXPO_PUBLIC_API_BASE_URL`: emulator `http://10.0.2.2:5000`, physical Android device `http://<computer-LAN-IP>:5000`. Configure a local LAN address in `apps/admin-mobile/.env` and permit inbound TCP 5000 in Windows Firewall where necessary.

## Ports and commands

- Client: http://localhost:5173 — `npm run dev:client`
- Admin: http://localhost:5174 — `npm run dev:admin`
- API: http://localhost:5000 — `npm run dev:server`
- Expo: `npm run dev:mobile` (Expo selects/displays its development server)
- All web apps and API: `npm run dev`
- Production web/API builds: `npm run build`; checks: `npm run typecheck`, `npm run lint`

Windows MongoDB service commands and verification are documented in [LOCAL_DEVELOPMENT_GUIDE.md](./LOCAL_DEVELOPMENT_GUIDE.md).

## Verification results

All results below were observed on 2026-10-12 in the local Windows environment:

- `npm install` — passed; npm workspace dependencies resolved and `package-lock.json` was generated.
- MongoDB — Windows service was running; TCP port 27017 was reachable. API logged `MongoDB connected: harghar_dev`.
- API — `GET /` returned development status; `/api/health` reported API running, MongoDB connected as `harghar_dev`, and a dynamic ISO timestamp; `/api/health/db` returned connected; `/api/test` returned success.
- Failure handling — a separate server started with `API_ONLY_MODE=true` reported database `disconnected`; `/api/health/db` returned HTTP 503. Starting with an unavailable local port (27018) logged `ECONNREFUSED`, aborted startup, and exited with code 1. Both browser apps were checked with a disconnected health response and displayed MongoDB unavailable/disconnected, then recovered to their live connected result.
- Root dev command — `npm run dev` started the backend, client, and admin together. Client and admin HTTP responses were 200; both `/api/health` Vite proxies reported MongoDB connected.
- Browser — client opened at `http://localhost:5173` and admin at `http://localhost:5174`; both rendered their live API/database status.
- `npm run build` — passed for server, client web, and admin web.
- `npm run typecheck` — passed for server, both web apps, and the mobile app.
- `npm run lint` — passed.
- `npx expo install --check` — passed; dependencies matched Expo SDK 57.
- `npx expo-doctor` — passed all 21 checks.
- `npx expo export --platform android` — passed and produced an Android JavaScript bundle.
- `npm run dev:mobile` — passed; Expo Metro started and listened on `http://localhost:8081`.
- Android launch — an installed Pixel 8 Pro emulator was attempted, but `adb devices` reported `emulator-5554 unauthorized`. The native app could not be installed/launched or tested against the API in that emulator. No physical Android phone was tested.
- Dependency audit — `npm audit --omit=dev` reported 28 findings (10 moderate, 18 high, 0 critical), primarily in the Expo/Metro toolchain dependency tree. npm reported that its forced automatic fix would downgrade Expo to 44; this breaking downgrade was not applied. Review and resolve these advisories before production use.

## Errors and fixes

No project files existed in the workspace at initial inspection. The initial build exposed TypeScript 6's deprecation of the old Node module-resolution setting and `baseUrl`; the API was moved to Node16 module resolution and the unused mobile alias options were removed. Expo validation identified an obsolete `newArchEnabled` config key and duplicate React/React Native versions; the key was removed and compatible singleton versions were pinned for the workspaces. An unused Express error-handler argument was wired through to Express when headers have already been sent, resolving ESLint. The first Expo command incorrectly forwarded flags through nested npm scripts; direct Expo CLI startup worked. The emulator's unauthorized ADB state remains unresolved.

## Remaining issues and unperformed checks

Physical Android device verification remains pending; configure `EXPO_PUBLIC_API_BASE_URL` to the development computer's LAN IPv4 address and allow TCP port 5000 through Windows Firewall. Emulator launch is also pending because the available emulator was unauthorized to ADB. The production dependency audit findings require review before production use.

## Scope confirmation

No product, inventory, pricing, order, customer, delivery, staff, branch, WhatsApp, device integration, or AI business module has been implemented. The mobile/web screens are service-setup and connectivity checks only.
