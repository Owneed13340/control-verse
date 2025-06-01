import { ApiProperty } from '@nestjs/swagger';

export class VehicleDto {
  @ApiProperty({ example: 'abc123', description: 'Identifiant unique du véhicule' })
  id: string;

  @ApiProperty({ example: 'Buggy #01', description: 'Nom du véhicule' })
  name: string;

  @ApiProperty({ example: 'buggy', description: 'Type de véhicule (buggy, monster, etc.)' })
  type: string;

  @ApiProperty({ example: 'available', description: 'Statut du véhicule (available, in-use, maintenance...)' })
  status: string;

  @ApiProperty({ example: 100, description: 'Niveau de batterie (en %)' })
  battery: number;

  @ApiProperty({ example: '2025-05-31T14:00:00.000Z', description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-31T14:05:00.000Z', description: 'Dernière mise à jour' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Informations du modèle associé',
    example: {
      id: 'model123',
      name: 'Wltoys 144001',
      type: 'buggy',
      status: 'active',
      description: 'Un modèle RC rapide et stable',
      imageUrl: 'https://cdn.exemple.com/model.jpg',
      defaultBattery: 100,
      price: 129.99,
      speed: 60,
    },
  })
  model: {
    id: string;
    name: string;
    type: string;
    status: string;
    description: string;
    imageUrl: string;
    defaultBattery: number;
    price: number;
    speed: number;
  };
}
