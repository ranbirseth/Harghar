# HARghAR

HARghAR is a multi-application foundation for a future multi-branch commerce and business platform. Phase 1 contains independent client and admin web applications, an Expo admin mobile app, and a shared Express/MongoDB API. No business modules are implemented yet.

## Windows prerequisites

- Node.js 24 LTS/current and npm 11 (Node.js 20.19+ is the minimum for Vite 7).
- Git.
- MongoDB Community Server 8.0 installed locally. Start its Windows service (`MongoDB`) from Services or run `Start-Service MongoDB` in an elevated PowerShell. Stop it with `Stop-Service MongoDB`. The service is configured by its MongoDB installation; default local port is 27017.
- Android Studio and an Android emulator for emulator testing. For a physical phone, install Expo Go and connect the phone and computer to the same Wi-Fi network.

Confirm MongoDB is running with `Get-Service MongoDB` and `Test-NetConnection 127.0.0.1 -Port 27017`.

## Install and configure

From this repository directory in PowerShell:

```powershell
npm install
Copy-Item server\.env.example server\.env
Copy-Item apps\client\.env.example apps\client\.env
Copy-Item apps\admin\.env.example apps\admin\.env
Copy-Item apps\admin-mobile\.env.example apps\admin-mobile\.env
```

The local MongoDB URI is `mongodb://127.0.0.1:27017/harghar_dev`. The API loads configuration from `server/.env`, validates it at startup, and exits if it cannot connect to MongoDB. To explicitly run API-only development without a database, set `API_ONLY_MODE=true` in `server/.env`; it is disabled by default. Never put the MongoDB URI or other server secrets into a frontend environment file.

For Android, configure `EXPO_PUBLIC_API_BASE_URL` in `apps/admin-mobile/.env`:

- Android Emulator: `http://10.0.2.2:5000`
- Physical Android phone on the same Wi-Fi: `http://<development-computer-LAN-IP>:5000` (find the IPv4 address with `ipconfig`). Ensure Windows Firewall allows inbound TCP port 5000 on the private network.
- Web development: `http://localhost:5000`

## Run

```powershell
npm run dev                 # API + client + admin
npm run dev:server          # API only
npm run dev:client          # Customer web only
npm run dev:admin           # Admin web only
npm run dev:mobile          # Expo development server
npm run build               # API and both web production builds
npm run typecheck           # API, web, and mobile TypeScript checks
npm run lint
```

Open the client at http://localhost:5173, admin at http://localhost:5174, and API at http://localhost:5000. Expo displays a QR code and offers the Android emulator/device launch options. The web apps use the configurable API base URL in each app's `.env.example`; Vite also proxies relative `/api` requests to port 5000 during development.

## API verification

- `GET /` identifies the HARghAR development API.
- `GET /api/health` reports API state, environment, timestamp, and the actual MongoDB state.
- `GET /api/health/db` returns database connectivity and responds with HTTP 503 while disconnected.
- `GET /api/test` verifies API communication.

## Repository layout

See [docs/LOCAL_DEVELOPMENT_GUIDE.md](docs/LOCAL_DEVELOPMENT_GUIDE.md) for environment and Windows networking details and [docs/PHASE_1_SETUP_REPORT.md](docs/PHASE_1_SETUP_REPORT.md) for observed setup and verification results.
