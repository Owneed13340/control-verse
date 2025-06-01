import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '12345', description: 'ID unique de l’utilisateur' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  lastName?: string;

  @ApiProperty({ example: 'FR' })
  country?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-10T00:00:00Z' })
  updatedAt: Date;
}
