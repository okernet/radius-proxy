import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters, UseGuards } from '@nestjs/common';
import {
	ApiForbiddenResponse,
	ApiHeader,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
	type AuthenticateResponse,
	AuthenticateResponseDto,
	type AuthorizeResponse,
	AuthorizeResponseDto,
} from 'src/radius/dto';
import {
	RadiusAccountingRequestDto as AccountingRequestDto,
	RadiusAuthorizeRequestDto as AuthorizeRequestDto,
} from './dto/radius-request.dto';
import { RadiusExceptionFilter } from './filters';
import { RadiusGuard } from './guards';
import { RadiusService } from './radius.service';

@ApiTags('RADIUS')
@Controller()
@UseGuards(RadiusGuard)
@UseFilters(RadiusExceptionFilter)
@ApiHeader({ name: 'X-Api-Key', description: 'API key for RADIUS authentication', required: true })
export class RadiusController {
	constructor(private readonly radiusService: RadiusService) {}

	@Post('authorize')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Authorize user (FreeRADIUS rlm_rest)',
		description: `
Returns control and reply attributes for FreeRADIUS authentication.
The control:Cleartext-Password is used by FreeRADIUS PAP/CHAP/MS-CHAP modules.

**HTTP Status Code Mapping:**
- 200 OK: Authorization successful, returns attributes
- 404 Not Found: User not found (FreeRADIUS: NOTFOUND)
- 403 Forbidden: User inactive (FreeRADIUS: DISALLOW)
    `,
	})
	@ApiOkResponse({ description: 'Authorization successful', type: AuthorizeResponseDto })
	@ApiNotFoundResponse({ description: 'User not found (NOTFOUND)' })
	@ApiForbiddenResponse({ description: 'User inactive (DISALLOW)' })
	authorize(@Body() body: AuthorizeRequestDto): Promise<AuthorizeResponse> {
		return this.radiusService.authorize(body);
	}

	@Post('authenticate')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Authenticate user (FreeRADIUS rlm_rest)',
		description: `
Validates password directly and returns reply attributes.
Use this for PAP when you want the REST API to validate the password.

**HTTP Status Code Mapping:**
- 200 OK: Authentication successful, returns reply attributes
- 404 Not Found: User not found (FreeRADIUS: NOTFOUND)
- 401 Unauthorized: Wrong password (FreeRADIUS: REJECT)
- 403 Forbidden: User inactive (FreeRADIUS: DISALLOW)
    `,
	})
	@ApiOkResponse({ description: 'Authentication successful', type: AuthenticateResponseDto })
	@ApiNotFoundResponse({ description: 'User not found (NOTFOUND)' })
	@ApiUnauthorizedResponse({ description: 'Wrong password (REJECT)' })
	@ApiForbiddenResponse({ description: 'User inactive (DISALLOW)' })
	authenticate(@Body() body: AuthorizeRequestDto): Promise<AuthenticateResponse> {
		return this.radiusService.authenticate(body);
	}

	@Post('accounting')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Process accounting data (FreeRADIUS rlm_rest)',
		description: `
Queues accounting data for later processing.
Supports Start, Stop, and Interim-Update records.

**HTTP Status Code Mapping:**
- 204 No Content: Accounting data queued successfully
    `,
	})
	@ApiNoContentResponse({ description: 'Accounting data queued successfully' })
	async accounting(@Body() body: AccountingRequestDto): Promise<void> {
		await this.radiusService.accounting(body);
	}
}
