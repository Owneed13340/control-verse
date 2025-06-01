import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class UpdateUserInput {
  @ApiPropertyOptional({ example: 'John', description: "Prénom de l'utilisateur" })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Field({ nullable: true })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: "Nom de famille de l'utilisateur" })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Field({ nullable: true })
  lastName?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Adresse e-mail' })
  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @ApiPropertyOptional({ example: 'FR', description: "Pays ou code région" })
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  country?: string;
}
