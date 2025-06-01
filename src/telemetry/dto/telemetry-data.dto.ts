import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TelemetryDataDto {
  @ApiProperty({ example: 50.123456 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 3.123456 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 75, description: 'Niveau de batterie (%)', required: false })
  @IsOptional()
  @IsNumber()
  battery?: number;
}
