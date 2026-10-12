# Local Development Guide

## Requirements

Install Node.js 24 and npm 11, Git, and MongoDB Community Server for Windows. Download the Community Server MSI from the [official MongoDB download page](https://www.mongodb.com/try/download/community), run the installer, and select the option to install MongoDB as a Windows service. MongoDB is expected at `127.0.0.1:27017`; this project does not use a remote database or start one for you.

Check or control the default MongoDB Windows service in an elevated PowerShell:

```powershell
Get-Service MongoDB
Start-Service MongoDB
Stop-Service MongoDB
Test-NetConnection 127.0.0.1 -Port 27017
```

You can also start or stop the service in Windows Services (`services.msc`). MongoDB's installer configures the service and its data directory. If the service was installed with a different name or configuration, use the path and service name selected during installation.

## Install

Run in the repository root:

```powershell
npm install
Copy-Item server\.env.example server\.env
Copy-Item apps\client\.env.example apps\client\.env
Copy-Item apps\admin\.env.example apps\admin\.env
Copy-Item apps\admin-mobile\.env.example apps\admin-mobile\.env
```

`server/.env` contains `MONGODB_URI=mongodb://127.0.0.1:27017/harghar_dev`. API startup validates environment configuration and fails if it cannot initially connect to MongoDB. Set `API_ONLY_MODE=true` only when you explicitly want the API and frontends to run without MongoDB; the health endpoints then correctly report it as disconnected.

## Start applications

`npm run dev` starts the API and two web apps together. Or run one at a time with `npm run dev:server`, `npm run dev:client`, and `npm run dev:admin`. Open client web at http://localhost:5173, admin web at http://localhost:5174, and API at http://localhost:5000.

Start Expo separately with `npm run dev:mobile`. For an Android Emulator set `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5000`; `10.0.2.2` routes from the emulator to the computer hosting the API. For a physical Android phone on the same Wi-Fi, use the computer's LAN IPv4 address, e.g. `http://192.168.1.25:5000` (find it with `ipconfig`). Allow port 5000 in Windows Defender Firewall for private networks if needed. `localhost` on the phone refers to the phone and will not reach the computer.

Expo public variables are bundled into the application; they must never contain credentials or server secrets. Restart Expo after changing `.env`.

## API checks

```powershell
Invoke-RestMethod http://localhost:5000/
Invoke-RestMethod http://localhost:5000/api/health
Invoke-RestMethod http://localhost:5000/api/health/db
Invoke-RestMethod http://localhost:5000/api/test
```

`/api/health` provides API status and the live database state. `/api/health/db` returns HTTP 503 when disconnected. The web apps use the configured API base URL and allow a relative `/api` request through the Vite development proxy. The apps use a 5-second request timeout (8 seconds on mobile) and have a manual refresh control.
