# Contributing to Radius Proxy

Thank you for your interest in contributing to Radius Proxy! This document provides guidelines and information for contributors.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check existing [issues](https://github.com/okernet/radius-proxy/issues) to avoid duplicates
2. Create a new issue with a clear title and description
3. Include relevant details:
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details (OS, Docker version, etc.)
   - Relevant logs or error messages

### Submitting Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines below
3. **Write or update tests** as needed
4. **Ensure all tests pass**: `npm run test`
5. **Run the linter**: `npm run lint`
6. **Submit a pull request** with a clear description of your changes

### Pull Request Guidelines

- Keep PRs focused on a single change
- Write clear commit messages
- Update documentation if needed
- Add tests for new functionality
- Ensure CI checks pass

## Development Workflow

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/radius-proxy.git
cd radius-proxy

# Install dependencies
npm install

# Copy environment example
cp .env.example .env

# Start development environment
docker compose -f docker-compose.dev.yml up
```

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

### Code Style

This project uses:

- **TypeScript** for type safety
- **ESLint** for linting
- **Prettier** for code formatting

Before committing, ensure your code passes linting:

```bash
npm run lint
npm run format
```

### Commit Messages

Write clear, concise commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues when relevant

Examples:
```
Add user caching for offline authentication
Fix CHAP authentication timeout handling
Update FreeRADIUS configuration for MS-CHAPv2
```

## Project Structure

```
radius-proxy/
├── src/
│   ├── entities/      # TypeORM entities
│   ├── env/           # Environment configuration
│   ├── health/        # Health check endpoints
│   ├── radius/        # RADIUS authentication logic
│   └── sync/          # Cloud synchronization
├── radius/            # FreeRADIUS Docker configuration
│   └── raddb/         # FreeRADIUS config files
├── test/              # Test files
└── data/              # SQLite database (gitignored)
```

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

## License

By contributing to Radius Proxy, you agree that your contributions will be licensed under the GPL-3.0 License.
