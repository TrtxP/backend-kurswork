# backend-kurswork

This repository contains the backend for the "backend-kurswork" project and instructions to run the frontend (Vite-based) and backend locally.

## Overview

The project is split into:
- Backend: PHP (WAMP) or any web server / API implementation shipped in this repo.
- Frontend: A separate Vite-based frontend (Vue, React or plain JS) that consumes backend APIs.

This README explains required technologies, setup steps, configuration and how to launch the frontend using Vite and run the backend locally on Windows (WAMP).

## Technologies

- Backend: PHP (WAMP/wamp64), optionally any PHP framework or plain PHP files provided in this repo.
- Database: MySQL / MariaDB (bundled with WAMP)
- Frontend: Vite (development server and build), compatible with frameworks such as Vue or React
- Dev tools: Node.js & npm / yarn for frontend package management

## Requirements

- Windows with WAMP installed (Wamp64) for backend
- Node.js (v14+) and npm or yarn for frontend
- Git (optional)

## Project structure (example)

- c:\wamp64\www\backend-kurswork\        # backend project files (PHP, routes, api)
- frontend/                                 # separate frontend project (Vite)

If your frontend is located inside this repository under `frontend/`, follow the frontend steps below. Otherwise open the frontend project folder that was created with `npm init @vitejs/app` or `npm create vite@latest`.

## Backend setup (WAMP)

1. Place this repository under WAMP's www directory: c:\wamp64\www\backend-kurswork
2. Start WAMP server and ensure Apache and MySQL services are running.
3. Configure virtual host or access via http://localhost/backend-kurswork/
4. Import database if an SQL dump is provided: use phpMyAdmin or mysql CLI.
5. Configure environment or config files (DB credentials, API settings) usually in a `.env` or config.php file inside the project. Example variables:

	 - DB_HOST=127.0.0.1
	 - DB_PORT=3306
	 - DB_NAME=backend_kurswork
	 - DB_USER=root
	 - DB_PASS=

6. Test backend endpoints in a browser or with curl/Postman: http://localhost/backend-kurswork/api/...

## Frontend setup (Vite)

If the frontend is a separate Vite project, open a terminal in the frontend folder and run:

1. Install dependencies

	 - npm install
	 - or: yarn

2. Configure API base URL for development. In Vite, commonly create a `.env` or `.env.development` file in the frontend root:

	 VITE_API_BASE_URL=http://localhost/backend-kurswork/api

3. Start the Vite development server:

	 - npm run dev
	 - or: yarn dev

This launches a dev server (default http://localhost:5173). Vite will proxy requests if configured, or the frontend can call the backend using absolute URL from `VITE_API_BASE_URL`.

### Example vite.config proxy (optional)

In vite.config.js you can add a proxy so that API calls to `/api` are forwarded to the backend:

	export default {
		server: {
			proxy: {
				'/api': {
					target: 'http://localhost',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '/backend-kurswork/api')
				}
			}
		}
	}

Adjust the rewrite and target values according to how your backend is served by WAMP.

## Build for production (frontend)

- npm run build (or yarn build)
- Output is in `dist/` folder. Deploy built files to your webserver or serve via a static host.

## Common environment variables and configuration

- Backend: DB credentials, app mode (development/production), JWT secrets, CORS settings.
- Frontend: VITE_API_BASE_URL, any feature flags.

## Troubleshooting

- If API calls fail, verify WAMP Apache is running and the API URL is reachable in the browser.
- Check browser console and network panel for CORS errors. If CORS blocks requests, enable appropriate headers on the backend or use Vite proxy.
- Ensure Node and npm versions are compatible with the frontend dependencies.

## Notes

- Keep sensitive credentials out of version control. Use .env files and add them to .gitignore.
- This README provides general steps — adapt paths and settings to your specific project layout and framework choices.

If you need an exact frontend framework (Vue/React/Svelte) configuration or a specific backend framework integration, provide the framework name and I can add framework-specific instructions.
