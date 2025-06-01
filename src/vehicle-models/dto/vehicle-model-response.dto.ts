import { ApiProperty } from '@nestjs/swagger';

export class VehicleModelResponseDto {
  @ApiProperty({ example: 'clxyz123', description: 'ID unique du modèle' })
  id: string;

  @ApiProperty({ example: 'HBX Monster 16889' })
  name: string;

  @ApiProperty({ example: 'buggy' })
  type: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  imageUrl?: string;

  @ApiProperty({ example: 100 })
  defaultBattery: number;

  @ApiProperty({ example: 'available' })
  status: string;

  @ApiProperty({ example: 149 })
  price: number;

  @ApiProperty({ example: 45 })
  speed: number;

  @ApiProperty({ example: 'Un modèle très rapide adapté aux courses tout-terrain.' })
  description?: string;
}
