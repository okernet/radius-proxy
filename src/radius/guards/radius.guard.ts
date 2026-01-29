import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvService } from '../../env/env.service';

@Injectable()
export class RadiusGuard implements CanActivate {
  constructor(private readonly envService: EnvService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const validApiKey = this.envService.get('RADIUS_API_KEY');

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
