#!/usr/bin/env bash
set -euo pipefail

# ---------- Defaults ----------
: "${REST_BASE_URL:=http://rest-api:8080}"
: "${REST_AUTH_ENDPOINT:=/radius/auth}"
: "${REST_ACCT_ENDPOINT:=/radius/accounting}"

: "${REST_API_HEADER_NAME:=X-API-Key}"
: "${REST_API_KEY:=}"

: "${RADIUS_CLIENT_IP:=0.0.0.0/0}"  # for quick testing; lock this down in prod!
: "${RADIUS_CLIENT_SECRET:=}"

: "${RADIUS_LISTEN_IP:=0.0.0.0}"
: "${RADIUS_AUTH_PORT:=1812}"
: "${RADIUS_ACCT_PORT:=1813}"

: "${FREERADIUS_DEBUG:=0}"

# ---------- Required checks ----------
if [[ -z "${REST_API_KEY}" ]]; then
  echo "ERROR: REST_API_KEY is required"
  exit 1
fi

if [[ -z "${RADIUS_CLIENT_SECRET}" ]]; then
  echo "ERROR: RADIUS_CLIENT_SECRET is required"
  exit 1
fi

echo "Starting FreeRADIUS with:"
echo "  REST_BASE_URL=${REST_BASE_URL}"
echo "  REST_AUTH_ENDPOINT=${REST_AUTH_ENDPOINT}"
echo "  REST_ACCT_ENDPOINT=${REST_ACCT_ENDPOINT}"
echo "  REST_API_HEADER_NAME=${REST_API_HEADER_NAME}"
echo "  RADIUS_CLIENT_IP=${RADIUS_CLIENT_IP}"
echo "  RADIUS_LISTEN_IP=${RADIUS_LISTEN_IP}"
echo "  RADIUS_AUTH_PORT=${RADIUS_AUTH_PORT}"
echo "  RADIUS_ACCT_PORT=${RADIUS_ACCT_PORT}"

if [[ "${FREERADIUS_DEBUG}" == "1" ]]; then
  exec freeradius -X -f -l stdout
fi

exec "$@"
