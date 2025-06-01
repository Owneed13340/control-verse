import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateRaceDto {
  @ApiProperty({ example: 'Course modifiée', description: 'Nom de la course' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Course de démonstration modifiée', description: 'Description de la course' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-06-02T12:00:00Z', description: 'Date de début de la course' })
  @IsDateString()
  @IsOptional()
  startTime?: string;
}
