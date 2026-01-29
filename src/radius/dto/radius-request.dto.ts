import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RadiusAuthorizeRequestDto {
  @ApiProperty({ description: 'Username from User-Name attribute' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ description: 'Password from User-Password attribute (for PAP)' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ description: 'Calling-Station-Id (MAC address of client)' })
  @IsString()
  @IsOptional()
  callingStationId?: string;

  @ApiPropertyOptional({ description: 'Called-Station-Id (MAC address of NAS)' })
  @IsString()
  @IsOptional()
  calledStationId?: string;

  @ApiPropertyOptional({ description: 'NAS-IP-Address' })
  @IsString()
  @IsOptional()
  nasIp?: string;
}

export class RadiusAccountingRequestDto {
  @ApiProperty({ description: 'Username from User-Name attribute' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Acct-Status-Type (Start, Stop, Interim-Update)' })
  @IsString()
  acctStatusType: string;

  @ApiPropertyOptional({ description: 'Acct-Session-Id' })
  @IsString()
  @IsOptional()
  acctSessionId?: string;

  @ApiPropertyOptional({ description: 'Acct-Unique-Session-Id (globally unique session identifier)' })
  @IsString()
  @IsOptional()
  acctUniqueSessionId?: string;

  @ApiPropertyOptional({ description: 'Acct-Session-Time in seconds' })
  @IsNumber()
  @IsOptional()
  acctSessionTime?: number;

  @ApiPropertyOptional({ description: 'Acct-Delay-Time in seconds' })
  @IsNumber()
  @IsOptional()
  acctDelayTime?: number;

  @ApiPropertyOptional({ description: 'Acct-Input-Octets (downloaded by client)' })
  @IsNumber()
  @IsOptional()
  acctInputOctets?: number;

  @ApiPropertyOptional({ description: 'Acct-Output-Octets (uploaded by client)' })
  @IsNumber()
  @IsOptional()
  acctOutputOctets?: number;

  @ApiPropertyOptional({ description: 'Acct-Input-Gigawords (high 32 bits of input octets)' })
  @IsNumber()
  @IsOptional()
  acctInputGigawords?: number;

  @ApiPropertyOptional({ description: 'Acct-Output-Gigawords (high 32 bits of output octets)' })
  @IsNumber()
  @IsOptional()
  acctOutputGigawords?: number;

  @ApiPropertyOptional({ description: 'Acct-Input-Packets' })
  @IsNumber()
  @IsOptional()
  acctInputPackets?: number;

  @ApiPropertyOptional({ description: 'Acct-Output-Packets' })
  @IsNumber()
  @IsOptional()
  acctOutputPackets?: number;

  @ApiPropertyOptional({ description: 'Acct-Authentic (RADIUS, Local, Remote)' })
  @IsString()
  @IsOptional()
  acctAuthentic?: string;

  @ApiPropertyOptional({ description: 'Acct-Terminate-Cause' })
  @IsString()
  @IsOptional()
  acctTerminateCause?: string;

  @ApiPropertyOptional({ description: 'NAS-IP-Address' })
  @IsString()
  @IsOptional()
  nasIpAddress?: string;

  @ApiPropertyOptional({ description: 'NAS-Port' })
  @IsNumber()
  @IsOptional()
  nasPort?: number;

  @ApiPropertyOptional({ description: 'NAS-Port-Type (Ethernet, Wireless, etc.)' })
  @IsString()
  @IsOptional()
  nasPortType?: string;

  @ApiPropertyOptional({ description: 'NAS-Port-Id (interface name like wlan1)' })
  @IsString()
  @IsOptional()
  nasPortId?: string;

  @ApiPropertyOptional({ description: 'NAS-Identifier (NAS device name)' })
  @IsString()
  @IsOptional()
  nasIdentifier?: string;

  @ApiPropertyOptional({ description: 'Service-Type (Framed-User, etc.)' })
  @IsString()
  @IsOptional()
  serviceType?: string;

  @ApiPropertyOptional({ description: 'Framed-Protocol (PPP, etc.)' })
  @IsString()
  @IsOptional()
  framedProtocol?: string;

  @ApiPropertyOptional({ description: 'Framed-IP-Address assigned to client' })
  @IsString()
  @IsOptional()
  framedIpAddress?: string;

  @ApiPropertyOptional({ description: 'Session-Timeout in seconds' })
  @IsNumber()
  @IsOptional()
  sessionTimeout?: number;

  @ApiPropertyOptional({ description: 'Idle-Timeout in seconds' })
  @IsNumber()
  @IsOptional()
  idleTimeout?: number;

  @ApiPropertyOptional({ description: 'Called-Station-Id (MAC address of NAS)' })
  @IsString()
  @IsOptional()
  calledStationId?: string;

  @ApiPropertyOptional({ description: 'Calling-Station-Id (MAC address of client)' })
  @IsString()
  @IsOptional()
  callingStationId?: string;

  @ApiPropertyOptional({ description: 'Event-Timestamp' })
  @IsString()
  @IsOptional()
  eventTimestamp?: string;

  @ApiPropertyOptional({ description: 'Mikrotik-Rate-Limit (vendor-specific)' })
  @IsString()
  @IsOptional()
  mikrotikRateLimit?: string;

  @ApiPropertyOptional({ description: 'X-Ascend-Data-Rate (download rate limit)' })
  @IsNumber()
  @IsOptional()
  ascendDataRate?: number;

  @ApiPropertyOptional({ description: 'Ascend-Xmit-Rate (upload rate limit)' })
  @IsNumber()
  @IsOptional()
  ascendXmitRate?: number;
}
