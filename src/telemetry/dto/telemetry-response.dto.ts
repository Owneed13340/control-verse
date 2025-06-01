import { ApiProperty } from '@nestjs/swagger';

export class TelemetryResponseDto {
  @ApiProperty({ example: 'uuid-telemetry-1234', description: 'ID unique de la télémétrie' })
  id: string;

  @ApiProperty({ example: 'vehicle_abc123', description: 'ID du véhicule lié à cette télémétrie' })
  vehicleId: string;

  @ApiProperty({ example: 92.5, description: 'Niveau de batterie (%)' })
  batteryLevel: number;

  @ApiProperty({ example: 38.8951, required: false, description: 'Latitude GPS (optionnel)' })
  latitude?: number;

  @ApiProperty({ example: -77.0364, required: false, description: 'Longitude GPS (optionnel)' })
  longitude?: number;

  @ApiProperty({ example: '2025-06-01T15:00:00Z', required: false, description: 'Horodatage ISO 8601' })
  timestamp?: string;
}
