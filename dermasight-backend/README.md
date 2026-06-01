# Dermasight Backend API

REST API for Dermasight — a skin lesion analysis platform. Built with **Bun**, **Express 5**, and **Prisma** (PostgreSQL). Authentication uses **Paseto v4** (local XChaCha20 encryption). Images stored in **Cloudflare R2**.

## Prerequisites

- [Bun](https://bun.sh) v1.3+
- PostgreSQL 15+

## Quick Start

```bash
bun install
cp .env.example .env   # fill in your environment variables
bun run db:migrate -- --name init
bun run dev
```

## Available Scripts

| Script                                | Description                                                          |
| ------------------------------------- | -------------------------------------------------------------------- |
| `bun run dev`                         | Start dev server with file watching (`bun run --watch src/index.ts`) |
| `bun run db:generate`                 | Regenerate Prisma client after schema changes                        |
| `bun run db:migrate -- --name <name>` | Create and apply a new Prisma migration                              |
| `bun run token:keygen`                | Generate a PASERK-format key pair for Paseto v4 local encryption     |
| `bun test`                            | Run all tests (Bun test runner)                                      |
| `bun test:watch`                      | Run tests in watch mode                                              |
| `bun run format`                      | Format code with Prettier                                            |

## Environment Variables

| Variable               | Required | Default      | Notes                                                                 |
| ---------------------- | -------- | ------------ | --------------------------------------------------------------------- |
| `PORT`                 | Yes      | —            | Server listen port                                                    |
| `COOKIE_SECRET`        | Yes      | —            | Fails startup if missing                                              |
| `HOST`                 | No       | `0.0.0.0`    | Set to `127.0.0.1` for local dev                                      |
| `API_PREFIX`           | No       | `/api`       | All routes mounted under this prefix                                  |
| `ENVIRONMENT`          | No       | —            | Set to `development` for verbose logging + error stack exposure       |
| `PASETO_SECRET_KEY`    | Yes      | —            | PASERK key for encrypting tokens. Generate via `bun run token:keygen` |
| `MODEL_API_URL`        | Yes      | —            | ML model inference endpoint (e.g., `http://localhost:8000`)           |
| `R2_STORAGE_URL`       | Yes      | —            | Cloudflare R2 endpoint URL                                            |
| `R2_ACCESS_KEY_ID`     | Yes      | —            | Cloudflare R2 access key ID                                           |
| `R2_SECRET_ACCESS_KEY` | Yes      | —            | Cloudflare R2 secret access key                                       |
| `R2_BUCKET_NAME`       | No       | `dermasight` | R2 bucket for uploaded images (predictions, articles)                 |
| `R2_REGION`            | No       | `auto`       | R2 region                                                             |
| `DB_HOST`              | Yes      | —            | PostgreSQL host                                                       |
| `DB_PORT`              | Yes      | —            | PostgreSQL port                                                       |
| `DB_USER`              | Yes      | —            | PostgreSQL user                                                       |
| `DB_PASSWORD`          | Yes      | —            | PostgreSQL password                                                   |
| `DB_NAME`              | Yes      | —            | PostgreSQL database name                                              |
| `SUPER_ADMIN_EMAIL`    | Yes      | —            | Email for initial admin user (seed script)                            |
| `SUPER_ADMIN_PASSWORD` | Yes      | —            | Password for initial admin user (seed script)                         |
| `SUPER_ADMIN_NAME`     | No       | Super Admin  | Display name for initial admin user                                   |
| `SMTP_HOST`            | Yes      | —            | SMTP server hostname for sending emails                               |
| `SMTP_PORT`            | Yes      | —            | SMTP port (e.g., 587 for TLS, 465 for SSL)                            |
| `SMTP_USER`            | Yes      | —            | SMTP authentication username                                          |
| `SMTP_PASS`            | Yes      | —            | SMTP authentication password                                          |
| `CONTACT_EMAIL`        | Yes      | —            | Comma-separated recipient emails for contact form submissions         |
| `CONTACT_FROM_EMAIL`   | No       | `SMTP_USER`  | Sender address for contact form emails                                |

## Architecture

- **Entrypoint:** `src/index.ts` — loads dotenv, starts HTTP server, registers process handlers
- **Middleware:** Express 5 pipeline: `express.json()` → `cookieParser` → `helmet` → morgan/winston → routes → 404 handler → error handler
- **Auth (Tokens):** Paseto v4 local tokens (access token in `Authorization: Bearer`, refresh token in httpOnly signed cookie)
- **Auth (Roles):** Two roles: `MEMBER` (default on register) and `ADMIN`. The `requireRole("ADMIN")` middleware guards admin-only endpoints. Chain with `requireAuth` to authenticate then authorize.
- **Database:** Prisma v7 with `@prisma/adapter-pg`, modular schema in `prisma/schema/`
- **Storage:** Cloudflare R2 (S3-compatible) via `@aws-sdk/client-s3`
- **ML Integration:** Forwards images to external model API, stores predictions and heatmaps in R2

## Testing

Uses Bun's built-in test runner (`bun test`). Test files live in `tests/`, mirroring `src/` structure. Mocks are set up globally via `tests/setup.ts` (preloaded in `bunfig.toml`).

```bash
bun test              # run all tests
bun test:watch        # run in watch mode
bun test --timeout 10000  # with custom timeout
```

## API

Full OpenAPI 3.0 spec at `docs/openapi.json`.

### Routes

| Method | Path                   | Auth   | Description                  |
| ------ | ---------------------- | ------ | ---------------------------- |
| GET    | `/api/health`          | —      | System health check          |
| POST   | `/api/auth/register`   | —      | Create account               |
| POST   | `/api/auth/login`      | —      | Log in                       |
| POST   | `/api/auth/refresh`    | —      | Rotate tokens                |
| POST   | `/api/auth/logout`     | —      | Log out                      |
| GET    | `/api/auth/me`         | Bearer | Current user profile         |
| GET    | `/api/articles`        | —      | List articles                |
| POST   | `/api/articles`        | ADMIN  | Create article               |
| GET    | `/api/articles/{slug}` | —      | Get article                  |
| PUT    | `/api/articles/{slug}` | ADMIN  | Update article               |
| DELETE | `/api/articles/{slug}` | ADMIN  | Delete article               |
| POST   | `/api/predict`         | —      | Analyze skin lesion image    |
| GET    | `/api/predict/history` | Bearer | List user's past predictions |
| POST   | `/api/contact-us`      | —      | Send contact form message    |

## Deployment

Docker Compose is provided for production deployment.

### Prerequisites

- Docker & Docker Compose v2
- A `.env` file with all required environment variables (see table above)
- Access to the container registry images: `ghcr.io/dermasight/dermasight-backend` and `ghcr.io/dermasight/dermasight-research-model-2`

### Startup Order

```
postgres (healthy)
  → backend-seed (CREATE DATABASE IF NOT EXISTS)
    → backend-migrate (prisma migrate deploy)
      → backend-seed-admin (create or update super admin user)
        → backend + model-api (parallel)
```

### Usage

```bash
docker compose up -d
```

All four services spin up in dependency order. The backend is exposed on `PORT` (default `5000`).

### Nginx Reverse Proxy (External)

For production, run nginx on the host to proxy to the backend:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Cloudflare handles TLS (orange cloud proxied DNS) — nginx only needs port 80.

### Build & Push Backend Image

```bash
docker build -t ghcr.io/dermasight/dermasight-backend:latest .
docker push ghcr.io/dermasight/dermasight-backend:latest
```

## Response Format

All responses follow `{ "status": "success"|"failed", "message": "...", "data": {} }`.

User objects include a `role` field (`"MEMBER"` or `"ADMIN"`). New registrations default to `"MEMBER"`.
