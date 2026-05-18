import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { RadiusUserNotFoundException, RadiusAuthRejectedException, RadiusDisallowedException } from '../exceptions';

/**
 * Exception filter for FreeRADIUS endpoints.
 * Ensures proper HTTP status codes are returned for FreeRADIUS rlm_rest module:
 * - 404: NOTFOUND (user not found)
 * - 401: REJECT (authentication failed)
 * - 403: DISALLOW (user found but access denied)
 */
@Catch()
export class RadiusExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RadiusExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = 500;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof RadiusUserNotFoundException) {
      status = 404;
      const body = exception.getResponse() as Record<string, unknown>;
      message = body.message as string;
      error = body.error as string;
      this.logger.warn(`User not found: ${message} [${request.method} ${request.url}]`);
    } else if (exception instanceof RadiusAuthRejectedException) {
      status = 401;
      const body = exception.getResponse() as Record<string, unknown>;
      message = body.message as string;
      error = body.error as string;
      this.logger.warn(`Auth rejected: ${message} [${request.method} ${request.url}]`);
    } else if (exception instanceof RadiusDisallowedException) {
      status = 403;
      const body = exception.getResponse() as Record<string, unknown>;
      message = body.message as string;
      error = body.error as string;
      this.logger.warn(`Access disallowed: ${message} [${request.method} ${request.url}]`);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'object' && body !== null) {
        message = ((body as Record<string, unknown>).message as string) || exception.message;
        error = ((body as Record<string, unknown>).error as string) || 'Error';
      } else {
        message = exception.message;
      }
      this.logger.warn(`HTTP Exception: ${message} [${request.method} ${request.url}]`);
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unexpected error: ${message} [${request.method} ${request.url}]`, exception.stack);
    } else {
      this.logger.error(`Unknown error: ${exception} [${request.method} ${request.url}]`);
    }

    response
      .status(status)
      .send({ statusCode: status, error, message, timestamp: new Date().toISOString(), path: request.url });
  }
}
