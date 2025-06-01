import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class RegisterDto {
  @ApiProperty({ example: 'John', description: "Prénom de l'utilisateur" })
  @IsString()
  @Length(1, 50)
  @Field()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: "Nom de famille de l'utilisateur" })
  @IsString()
  @Length(1, 50)
  @Field()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Adresse e-mail' })
  @IsEmail()
  @Field()
  email: string;

  @ApiProperty({ example: 'FR', description: 'Pays ou code région' })
  @IsString()
  @Field()
  country: string;

  @ApiProperty({ example: 'Password123!', description: 'Mot de passe' })
  @IsString()
  @MinLength(6)
  @Field()
  password: string;
}
