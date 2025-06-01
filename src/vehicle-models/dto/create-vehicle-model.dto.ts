import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleModelDto {
  @ApiProperty({ example: 'HBX Monster 16889', description: 'Nom du modèle de véhicule' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'buggy', description: 'Type de véhicule (e.g., buggy, truck, drone)' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg', description: 'URL de l’image illustrative du véhicule' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 100, description: 'Batterie par défaut du modèle' })
  @IsInt()
  defaultBattery: number;

  @ApiPropertyOptional({ example: 'available', description: 'Statut du modèle (e.g., available, hidden)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 149.99, description: 'Prix du véhicule en euros' })
  @IsInt()
  price: number;

  @ApiProperty({ example: 45, description: 'Vitesse maximale en km/h' })
  @IsInt()
  speed: number;

  @ApiPropertyOptional({ example: 'Un modèle très rapide adapté aux courses tout-terrain.', description: 'Description libre du modèle' })
  @IsOptional()
  @IsString()
  description?: string;
}
