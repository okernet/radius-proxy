# Third-Party Software

This project incorporates and depends on third-party open source software. This document provides attribution and licensing information for these components.

## FreeRADIUS

This project uses FreeRADIUS as its RADIUS server component.

- **Project**: FreeRADIUS
- **Source**: https://github.com/FreeRADIUS/freeradius-server
- **Website**: https://www.freeradius.org/
- **License**: GNU General Public License v2.0 (GPL-2.0)
- **Usage**: RADIUS protocol handling (authentication and accounting)

FreeRADIUS is the world's most popular RADIUS server. It is the basis for multiple commercial offerings and supplies the AAA needs of many Fortune 500 companies and Tier 1 ISPs.

### License Notice

FreeRADIUS is licensed under the GNU General Public License version 2 (GPLv2). The full text of the GPLv2 license can be found at: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html

## GPL Compliance

This project (radius-proxy) is licensed under the GNU General Public License v3.0 (GPL-3.0), which is compatible with the GPL-2.0 license used by FreeRADIUS.

### Source Code Availability

In compliance with the GPL licenses:

- The complete source code for this project is available at: https://github.com/okernet/radius-proxy
- FreeRADIUS source code is available at: https://github.com/FreeRADIUS/freeradius-server
- The Docker images used in this project are built from publicly available Dockerfiles included in this repository

### Obtaining Source Code

If you have received this software in binary form and would like to obtain the source code, you may:

1. Clone this repository: `git clone https://github.com/okernet/radius-proxy.git`
2. Access FreeRADIUS source: `git clone https://github.com/FreeRADIUS/freeradius-server.git`

## Node.js Dependencies

This project uses various Node.js packages. These dependencies are listed in `package.json` and are installed via npm. Each package is subject to its own license terms, which can be reviewed in the respective `node_modules/<package>/LICENSE` files after installation.

Key dependencies include:
- NestJS (MIT License)
- TypeORM (MIT License)
- better-sqlite3 (MIT License)
- Fastify (MIT License)

For a complete list of dependencies and their licenses, run:

```bash
npm install
npx license-checker --summary
```
