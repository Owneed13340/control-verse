import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  battery?: number;
}
