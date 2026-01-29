import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * FreeRADIUS rlm_rest module expects responses with control: and reply: prefixed attributes.
 * - control: attributes are used internally by FreeRADIUS for authentication
 * - reply: attributes are sent back to the NAS in the Access-Accept packet
 */
export interface AuthorizeResponse {
  'control:Cleartext-Password'?: string;
  'reply:Mikrotik-Rate-Limit'?: string;
  'reply:Session-Timeout'?: number;
  'reply:Idle-Timeout'?: number;
  'reply:Reply-Message'?: string;
  [key: string]: string | number | undefined;
}

export interface AuthenticateResponse {
  'reply:Mikrotik-Rate-Limit'?: string;
  'reply:Session-Timeout'?: number;
  'reply:Idle-Timeout'?: number;
  'reply:Reply-Message'?: string;
  [key: string]: string | number | undefined;
}

/**
 * DTO class for Swagger documentation of authorize response
 */
export class AuthorizeResponseDto {
  @ApiProperty({ description: 'Cleartext password for FreeRADIUS to validate' })
  'control:Cleartext-Password': string;

  @ApiPropertyOptional({ description: 'Mikrotik rate limit string (e.g., "10M/10M")' })
  'reply:Mikrotik-Rate-Limit'?: string;

  @ApiPropertyOptional({ description: 'Session timeout in seconds' })
  'reply:Session-Timeout'?: number;

  @ApiPropertyOptional({ description: 'Idle timeout in seconds' })
  'reply:Idle-Timeout'?: number;
}

/**
 * DTO class for Swagger documentation of authenticate response
 */
export class AuthenticateResponseDto {
  @ApiPropertyOptional({ description: 'Mikrotik rate limit string (e.g., "10M/10M")' })
  'reply:Mikrotik-Rate-Limit'?: string;

  @ApiPropertyOptional({ description: 'Session timeout in seconds' })
  'reply:Session-Timeout'?: number;
}

/**
 * Helper class to build FreeRADIUS responses with proper attribute prefixes
 */
export class ResponseBuilder {
  private response: Record<string, string | number> = {};

  /**
   * Add a control attribute (used by FreeRADIUS internally)
   */
  control(attribute: string, value: string | number): this {
    this.response[`control:${attribute}`] = value;
    return this;
  }

  /**
   * Add a reply attribute (sent to NAS in Access-Accept)
   */
  reply(attribute: string, value: string | number): this {
    this.response[`reply:${attribute}`] = value;
    return this;
  }

  /**
   * Set the cleartext password for PAP/CHAP/MS-CHAP authentication
   */
  setPassword(password: string): this {
    return this.control('Cleartext-Password', password);
  }

  /**
   * Set Mikrotik rate limit (e.g., "10M/10M" for 10Mbps up/down)
   */
  setRateLimit(rateLimit: string): this {
    return this.reply('Mikrotik-Rate-Limit', rateLimit);
  }

  /**
   * Set session timeout in seconds
   */
  setSessionTimeout(seconds: number): this {
    return this.reply('Session-Timeout', seconds);
  }

  /**
   * Set idle timeout in seconds
   */
  setIdleTimeout(seconds: number): this {
    return this.reply('Idle-Timeout', seconds);
  }

  /**
   * Set reply message
   */
  setReplyMessage(message: string): this {
    return this.reply('Reply-Message', message);
  }

  /**
   * Build the final response object
   */
  build(): AuthorizeResponse {
    return { ...this.response };
  }
}
