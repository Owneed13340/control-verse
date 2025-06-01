import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  battery?: number;

  @IsString()
  @IsNotEmpty()
  modelId: string; // ✅ Ajouté pour lier le véhicule à son modèle
}
