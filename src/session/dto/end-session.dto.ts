import { IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class EndSessionDto {
  @IsUUID()
  @IsNotEmpty()
  sessionId: string;

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsInt()
  @IsOptional()
  score?: number;
}
