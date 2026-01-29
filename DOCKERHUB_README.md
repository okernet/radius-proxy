# Radius Proxy REST API

On-premises RADIUS authentication REST API server that integrates with OkerNet Cloud. Provides local RADIUS authentication with cloud synchronization for user management, supporting offline operation when cloud connectivity is unavailable.

## Quick Start

```bash
docker run -d \
  --name radius-proxy \
  -p 3080:3080 \
  -v radius-data:/usr/app/data \
  -e OIDC_ISSUER=https://id.okernet.com/realms/okernet \
  -e OIDC_CLIENT_ID=your-client-id \
  -e OIDC_CLIENT_SECRET=your-client-secret \
  -e CLOUD_API_URL=https://api.okernet.net \
  -e RADIUS_API_KEY=your-api-key \
  okernet/radius-proxy
```

## Docker Compose (Recommended)

For a complete setup with FreeRADIUS, download the production compose file:

```bash
curl -O https://raw.githubusercontent.com/okernet/radius-proxy/main/docker-compose.prod.yml
```

Create a `.env` file:

```bash
# App Configuration
PORT=3080
HOST=0.0.0.0
LOG_LEVEL=info

# OIDC Auth (obtain from OkerNet Cloud provisioning)
OIDC_ISSUER=https://id.okernet.com/realms/okernet
OIDC_CLIENT_ID=radius-proxy-<tenant-id>
OIDC_CLIENT_SECRET=<secret-from-provisioning>

# Cloud Connection
CLOUD_API_URL=https://api.okernet.net
CLOUD_TIMEOUT_MS=10000

# Sync Settings
SYNC_INTERVAL_MS=60000
ACCOUNTING_UPLOAD_INTERVAL_MS=10000
ACCOUNTING_BATCH_SIZE=100

# Database
DB_PATH=./data/radius-proxy.sqlite

# Security
RADIUS_API_KEY=<your-secure-api-key>
RADIUS_CLIENT_SECRET=<your-radius-shared-secret>
```

Start the services:

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | REST API port | `3080` |
| `HOST` | REST API bind address | `0.0.0.0` |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) | `info` |
| `OIDC_ISSUER` | OIDC issuer URL for cloud auth | Required |
| `OIDC_CLIENT_ID` | OIDC client ID | Required |
| `OIDC_CLIENT_SECRET` | OIDC client secret | Required |
| `CLOUD_API_URL` | OkerNet Cloud API URL | Required |
| `CLOUD_TIMEOUT_MS` | Cloud API timeout in milliseconds | `10000` |
| `SYNC_INTERVAL_MS` | User sync interval in milliseconds | `60000` |
| `ACCOUNTING_UPLOAD_INTERVAL_MS` | Accounting upload interval | `10000` |
| `ACCOUNTING_BATCH_SIZE` | Max records per accounting upload | `100` |
| `DB_PATH` | SQLite database path | `/usr/app/data/radius-proxy.sqlite` |
| `RADIUS_API_KEY` | API key for FreeRADIUS to REST API auth | Required |

## Volumes

| Path | Description |
|------|-------------|
| `/usr/app/data` | SQLite database storage (persist this volume) |

## Ports

| Port | Description |
|------|-------------|
| `3080` | REST API (HTTP) |

## Health Check

The container includes a built-in health check at `/health` endpoint.

```bash
curl http://localhost:3080/health
```

## Supported Architectures

- `linux/amd64`
- `linux/arm64`

## Source Code

GitHub: [https://github.com/okernet/radius-proxy](https://github.com/okernet/radius-proxy)

## Related Images

- [okernet/radius](https://hub.docker.com/r/okernet/radius) - FreeRADIUS server configured to work with this REST API

## License

GNU General Public License v3.0 - See [LICENSE](https://github.com/okernet/radius-proxy/blob/main/LICENSE) for details.
