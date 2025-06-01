import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateRaceDto {
  @ApiProperty({ example: 'Course 1', description: 'Nom de la course' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Course de démonstration', description: 'Description de la course' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-06-01T12:00:00Z', description: 'Date de début de la course' })
  @IsDateString()
  startTime: string;
}
