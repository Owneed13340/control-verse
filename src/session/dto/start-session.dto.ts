import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class StartSessionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @IsUUID()
  @IsOptional()
  raceId?: string;
}
