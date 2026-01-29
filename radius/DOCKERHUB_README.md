# FreeRADIUS Server for Radius Proxy

Pre-configured FreeRADIUS server that integrates with the [okernet/radius-proxy](https://hub.docker.com/r/okernet/radius-proxy) REST API for authentication. Supports PAP, CHAP, and MS-CHAPv2 authentication protocols.

## Quick Start

This image is designed to work with the `okernet/radius-proxy` REST API. Use Docker Compose for the recommended setup.

```bash
curl -O https://raw.githubusercontent.com/okernet/radius-proxy/main/docker-compose.prod.yml
```

Create a `.env` file with your configuration (see below), then:

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Standalone Usage

If running separately from the REST API:

```bash
docker run -d \
  --name radius \
  -p 1812:1812/udp \
  -p 1813:1813/udp \
  -e REST_BASE_URL=http://rest-api-host:3080 \
  -e REST_AUTH_ENDPOINT=/radius/auth \
  -e REST_ACCT_ENDPOINT=/radius/accounting \
  -e REST_API_HEADER_NAME=X-API-Key \
  -e REST_API_KEY=your-api-key \
  -e RADIUS_CLIENT_IP=0.0.0.0 \
  -e RADIUS_CLIENT_SECRET=your-shared-secret \
  okernet/radius
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REST_BASE_URL` | Base URL of the REST API | Required |
| `REST_AUTH_ENDPOINT` | Authentication endpoint path | `/radius/auth` |
| `REST_ACCT_ENDPOINT` | Accounting endpoint path | `/radius/accounting` |
| `REST_API_HEADER_NAME` | Header name for API key | `X-API-Key` |
| `REST_API_KEY` | API key for REST API authentication | Required |
| `RADIUS_CLIENT_IP` | Allowed RADIUS client IP (use `0.0.0.0` for any) | `0.0.0.0` |
| `RADIUS_CLIENT_SECRET` | Shared secret for RADIUS clients | Required |
| `RADIUS_LISTEN_IP` | IP address to listen on | `0.0.0.0` |
| `RADIUS_AUTH_PORT` | Authentication port | `1812` |
| `RADIUS_ACCT_PORT` | Accounting port | `1813` |
| `FREERADIUS_DEBUG` | Enable debug logging (0 or 1) | `0` |

## Ports

| Port | Protocol | Description |
|------|----------|-------------|
| `1812` | UDP | RADIUS Authentication |
| `1813` | UDP | RADIUS Accounting |

## RADIUS Client Configuration

Configure your RADIUS clients (routers, access points, VPN concentrators) with:

| Setting | Value |
|---------|-------|
| Server IP | Your Docker host IP |
| Authentication Port | 1812 (UDP) |
| Accounting Port | 1813 (UDP) |
| Shared Secret | Value of `RADIUS_CLIENT_SECRET` |
| Protocol | PAP, CHAP, or MS-CHAPv2 |

### MikroTik Example

```routeros
/radius
add address=<radius-server-ip> secret=<RADIUS_CLIENT_SECRET> service=hotspot,login,ppp

/ip hotspot profile
set default use-radius=yes
```

## Supported Architectures

- `linux/amd64`
- `linux/arm64`

## Source Code

GitHub: [https://github.com/okernet/radius-proxy](https://github.com/okernet/radius-proxy)

The FreeRADIUS configuration files are located in the `radius/` directory.

## Related Images

- [okernet/radius-proxy](https://hub.docker.com/r/okernet/radius-proxy) - REST API server (required for authentication)

## License

GNU General Public License v3.0 - See [LICENSE](https://github.com/okernet/radius-proxy/blob/main/LICENSE) for details.
