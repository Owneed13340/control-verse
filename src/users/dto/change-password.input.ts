import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class ChangePasswordInput {
  @ApiProperty({
    example: 'AncienMotDePasse123!',
    description: 'Mot de passe actuel de l’utilisateur',
  })
  @IsString()
  @MinLength(8)
  @Field(() => String)
  oldPassword: string;

  @ApiProperty({
    example: 'NouveauMotDePasse456!',
    description: 'Nouveau mot de passe à définir',
  })
  @IsString()
  @MinLength(8)
  @Field(() => String)
  newPassword: string;
}
