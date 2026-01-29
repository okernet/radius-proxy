# FreeRADIUS + REST (Env-configured) Container

This repository builds a FreeRADIUS v3 container that uses the `rlm_rest` module
for authentication + accounting, and is configured entirely via environment variables.

## Environment variables

| Variable | Description | Example |
|---|---|---|
| REST_BASE_URL | REST API base URL | `http://rest-api:8080` |
| REST_AUTH_ENDPOINT | Auth endpoint path | `/radius/auth` |
| REST_ACCT_ENDPOINT | Accounting endpoint path | `/radius/accounting` |
| REST_API_HEADER_NAME | Header name for API key | `X-API-Key` |
| REST_API_KEY | API key value (required) | `supersecret` |
| RADIUS_CLIENT_IP | NAS/router IP/CIDR allowed | `10.0.0.1` or `10.0.0.0/24` |
| RADIUS_CLIENT_SECRET | RADIUS shared secret (required) | `router-shared-secret` |
| RADIUS_LISTEN_IP | IP to bind RADIUS listeners | `0.0.0.0` |
| RADIUS_AUTH_PORT | Auth UDP port | `1812` |
| RADIUS_ACCT_PORT | Acct UDP port | `1813` |
| FREERADIUS_DEBUG | `1` = run `freeradius -X` | `1` |

## Build

```bash
docker build -t my-freeradius-rest .
```

## Run

```bash
docker run --rm -it \
  -p 1812:1812/udp \
  -p 1813:1813/udp \
  -e REST_BASE_URL="http://your-api:8080" \
  -e REST_AUTH_ENDPOINT="/radius/auth" \
  -e REST_ACCT_ENDPOINT="/radius/accounting" \
  -e REST_API_HEADER_NAME="X-API-Key" \
  -e REST_API_KEY="supersecret-api-key" \
  -e RADIUS_CLIENT_IP="10.0.0.1" \
  -e RADIUS_CLIENT_SECRET="router-shared-secret" \
  -e RADIUS_LISTEN_IP="0.0.0.0" \
  my-freeradius-rest
```

## Quick test

```bash
radtest alice password 127.0.0.1 0 router-shared-secret
```
