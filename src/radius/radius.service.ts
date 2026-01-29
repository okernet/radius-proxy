import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalSubscription } from '../entities/subscription.entity';
import { AccountingQueue, AccountingQueueStatus } from '../entities/accounting-queue.entity';
import { RadiusAuthorizeRequestDto, RadiusAccountingRequestDto } from './dto/radius-request.dto';
import { AuthorizeResponse, AuthenticateResponse, ResponseBuilder } from './dto/radius-response.dto';
import { RadiusUserNotFoundException, RadiusAuthRejectedException, RadiusDisallowedException } from './exceptions';

@Injectable()
export class RadiusService {
  private readonly logger = new Logger(RadiusService.name);

  constructor(
    @InjectRepository(LocalSubscription)
    private readonly subscriptionRepository: Repository<LocalSubscription>,
    @InjectRepository(AccountingQueue)
    private readonly accountingQueueRepository: Repository<AccountingQueue>,
  ) {}

  /**
   * Authorize endpoint for FreeRADIUS rlm_rest module.
   * Returns control:Cleartext-Password for FreeRADIUS to validate PAP/CHAP/MS-CHAP.
   *
   * HTTP Status Codes:
   * - 200: OK - returns control and reply attributes
   * - 404: NOTFOUND - user not found
   * - 403: DISALLOW - user found but inactive
   */
  async authorize(request: RadiusAuthorizeRequestDto): Promise<AuthorizeResponse> {
    const { username } = request;
    this.logger.debug(`Authorize request for user: ${username}`);

    const subscription = await this.subscriptionRepository.findOne({ where: { username } });

    if (!subscription) {
      this.logger.warn(`User not found: ${username}`);
      throw new RadiusUserNotFoundException(username);
    }

    if (!subscription.isActive) {
      this.logger.warn(`User inactive: ${username}`);
      throw new RadiusDisallowedException(username, 'Subscription is inactive');
    }

    this.logger.debug(`Authorization successful for user: ${username}`);

    const response = new ResponseBuilder()
      .setPassword(subscription.password)
      .setRateLimit(subscription.bandwidth)
      .build();

    return response;
  }

  /**
   * Authenticate endpoint for FreeRADIUS rlm_rest module (PAP direct validation).
   * Validates password directly and returns reply attributes if successful.
   *
   * HTTP Status Codes:
   * - 200: OK - authentication successful, returns reply attributes
   * - 404: NOTFOUND - user not found
   * - 401: REJECT - wrong password
   * - 403: DISALLOW - user found but inactive
   */
  async authenticate(request: RadiusAuthorizeRequestDto): Promise<AuthenticateResponse> {
    const { username, password } = request;
    this.logger.debug(`Authenticate request for user: ${username}`);

    const subscription = await this.subscriptionRepository.findOne({
      where: { username },
    });

    if (!subscription) {
      this.logger.warn(`User not found: ${username}`);
      throw new RadiusUserNotFoundException(username);
    }

    if (!subscription.isActive) {
      this.logger.warn(`User inactive: ${username}`);
      throw new RadiusDisallowedException(username, 'Subscription is inactive');
    }

    if (password && subscription.password !== password) {
      this.logger.warn(`Authentication failed for user: ${username} - wrong password`);
      throw new RadiusAuthRejectedException(username, 'Invalid password');
    }

    this.logger.debug(`Authentication successful for user: ${username}`);

    const response = new ResponseBuilder().setRateLimit(subscription.bandwidth).build();

    return response;
  }

  /**
   * Accounting endpoint for FreeRADIUS rlm_rest module.
   * Queues accounting data for later processing.
   *
   * HTTP Status Codes:
   * - 204: No Content - accounting data queued successfully
   */
  async accounting(request: RadiusAccountingRequestDto): Promise<void> {
    const { username, acctStatusType } = request;
    this.logger.debug(`Accounting ${acctStatusType} for user: ${username}`);
    const queueEntry = new AccountingQueue();
    queueEntry.payload = JSON.stringify(request);
    queueEntry.status = AccountingQueueStatus.PENDING;
    await this.accountingQueueRepository.save(queueEntry);
    this.logger.debug(`Accounting data queued for user: ${username}`);
  }
}
