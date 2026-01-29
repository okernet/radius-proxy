import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Thrown when a user is not found in the database.
 * Results in HTTP 404 which RADIUS maps to NOTFOUND.
 */
export class RadiusUserNotFoundException extends HttpException {
  constructor(username: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'User Not Found',
        message: `User '${username}' not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Thrown when authentication is rejected (wrong password).
 * Results in HTTP 401 which RADIUS maps to REJECT.
 */
export class RadiusAuthRejectedException extends HttpException {
  constructor(username: string, reason?: string) {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Authentication Rejected',
        message: reason || `Authentication rejected for user '${username}'`,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * Thrown when a user is found but access is disallowed (e.g., inactive subscription).
 * Results in HTTP 403 which RADIUS maps to DISALLOW.
 */
export class RadiusDisallowedException extends HttpException {
  constructor(username: string, reason?: string) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Access Disallowed',
        message: reason || `Access disallowed for user '${username}'`,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
