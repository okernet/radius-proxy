# Security Policy

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@okernet.com

Include the following information:

- Type of vulnerability
- Full paths of affected source files
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

### What to Expect

- **Acknowledgment**: We will acknowledge receipt within 48 hours
- **Updates**: We will provide updates on the progress of addressing the vulnerability
- **Resolution**: We aim to resolve critical vulnerabilities promptly
- **Credit**: We will credit reporters in the security advisory (unless you prefer to remain anonymous)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Security Considerations

When deploying Radius Proxy, consider the following security best practices:

### Network Security

- Deploy the RADIUS server on a private network when possible
- Use firewall rules to restrict access to RADIUS ports (1812, 1813) to known clients only
- Consider using a VPN for remote RADIUS client connections

### Credentials

- Use strong, randomly generated values for:
  - `RADIUS_API_KEY` - Internal API authentication
  - `RADIUS_CLIENT_SECRET` - RADIUS shared secret
  - `OIDC_CLIENT_SECRET` - Cloud authentication
- Rotate secrets periodically
- Never commit secrets to version control

### Docker Security

- Keep Docker and container images updated
- Run containers with minimal privileges
- Use Docker secrets or external secret management in production

### Monitoring

- Enable logging (`LOG_LEVEL=info` or `debug` for troubleshooting)
- Monitor for unusual authentication patterns
- Set up alerts for repeated authentication failures

### Data Protection

- The SQLite database contains cached user credentials
- Ensure the `data/` directory has appropriate filesystem permissions
- Consider encrypting the data volume in production
