# Cloudflare R2 Client

A desktop client for browsing and managing Cloudflare R2 buckets and objects. It ships as an Electron app with its own bundled backend, so everything runs locally and talks directly to the Cloudflare API.

## Download

Grab the latest build from the [releases page](https://github.com/tumeraltunbas/r2-client/releases).

The macOS build is not signed with an Apple Developer certificate, so Gatekeeper will refuse it on first launch. Right-click the app and choose **Open** to run it anyway.

## Features

-   **Buckets** — list, create, and delete, with multi-select deletion.
-   **Objects** — list, upload, download, and delete, with multi-select upload and deletion.
-   **Preview** — images, video, and PDF open in an in-app modal.
-   **Batch download** — selecting more than one object returns a ZIP.
-   **Credentials** — your account ID and API token are encrypted with the OS keychain via Electron's `safeStorage`. They are never sent anywhere except the Cloudflare API.

## Architecture

Three parts: an Electron main process that owns the window and the credential store, a React renderer, and a Fastify backend that the main process forks as a child. The renderer calls `window.api` for credentials and plain `fetch` against `localhost:3000` for everything else.

The backend exists so the API token never reaches renderer JavaScript, and so multi-object downloads can be zipped server-side.

On launch the main process decrypts `credentials.bin` and starts the backend before showing the window. Saving credentials from the settings screen starts the backend and waits for the port before resolving, so the first bucket fetch cannot race startup.

## Requirements

-   Node.js 22 or newer (developed on 22.19.0)
-   A Cloudflare account with an R2 API token

## Getting started

```bash
cd backend && npm install
cd ../frontend && npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env`:

| Variable                | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| `PORT`                  | Port the backend listens on. Set this to `3000`.                    |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID.                                         |
| `CLOUDFLARE_API_TOKEN`  | An R2 API token with bucket and object permissions.                 |
| `CLIENT_BASE_URL`       | Origin allowed by CORS. Use `http://localhost:4173` in development. |

`frontend/.env`:

| Variable            | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `VITE_API_BASE_URL` | Base URL of the backend, e.g. `http://localhost:3000`. |

These values are only used when you run the backend on its own. In the packaged app the main process overrides them with the credentials you enter in the UI.

## Running

```bash
cd frontend && npm run electron:dev   # Vite + Electron together
cd backend && npm run start:dev       # backend alone, for testing with curl
```

## Building

Build the backend first — `electron-builder` copies `backend/dist` into the bundle but does not build it for you:

```bash
cd backend && npm run build
cd ../frontend && npm run dist:mac   # or dist:win
```

Artifacts land in `frontend/release/`. The macOS target is a DMG and the Windows target is an NSIS installer.

## HTTP API

All routes are prefixed with `/cloudflare`. The frontend calls exactly these, so change both sides together.

| Method | Path                                         | Body                    | Returns                                                  |
| ------ | -------------------------------------------- | ----------------------- | -------------------------------------------------------- |
| `GET`  | `/cloudflare/buckets`                        | —                       | `{ buckets: [{ name, creationDate }] }`                  |
| `POST` | `/cloudflare/buckets`                        | `{ name }`              | `{ name }`                                               |
| `POST` | `/cloudflare/buckets/remove`                 | `{ names: string[] }`   | `200`, empty body                                        |
| `GET`  | `/cloudflare/buckets/:name/objects`          | —                       | `{ objects: [{ key, size, lastModified }] }`             |
| `POST` | `/cloudflare/buckets/:name/objects`          | multipart, field `file` | `200`, empty body                                        |
| `POST` | `/cloudflare/buckets/:name/objects/remove`   | `{ keys: string[] }`    | `200`, empty body                                        |
| `POST` | `/cloudflare/buckets/:name/objects/download` | `{ keys: string[] }`    | file bytes, or a ZIP when `keys` has more than one entry |

Deletion and download are `POST` with a body rather than `DELETE`/`GET`, because both operate on a list of names.

## Project layout

```
backend/src/
  configuration/     env parsing
  constants/         routes, Cloudflare endpoints, enums, error codes
  controllers/       thin request handlers
  infrastructure/    Cloudflare fetch client, error classes and handler
  models/dtos/       request and response shapes
  request-clients/   one method per Cloudflare operation
  routes/            Fastify route registration with JSON schemas
  services/          business logic, ZIP generation
frontend/
  electron/          main process and preload bridge
  src/components/    layout and UI primitives
  src/pages/         settings, bucket list, object list
  src/router/        hash router
  src/services/      loaders, queries, mutations
```

The frontend uses TanStack Query for server state, React Router loaders for route-level data, and hand-written Tailwind components rather than a UI library.

## Security

-   The API token is encrypted at rest with `safeStorage` (macOS Keychain, Windows DPAPI). On Linux the app does not check `safeStorage.isEncryptionAvailable()`, so it may silently fall back to a weaker store.
-   The backend listens on `localhost` without authentication, so any local process can reach it while the app runs.
-   The renderer uses `contextIsolation: true` and `nodeIntegration: false`. Keep it that way.

## License

ISC
