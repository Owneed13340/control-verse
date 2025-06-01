import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTelemetryDto {
  @ApiProperty({ example: 92.5, description: 'Niveau de batterie en %' })
  @IsNumber()
  batteryLevel: number;

  @ApiProperty({ example: 38.8951, description: 'Latitude GPS' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -77.0364, description: 'Longitude GPS' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: '2025-06-01T15:00:00Z', description: 'Horodatage (optionnel)' })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
