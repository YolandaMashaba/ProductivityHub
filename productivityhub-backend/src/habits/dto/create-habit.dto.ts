import { IsString, IsOptional, IsMongoId, IsIn } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly'])
  frequency?: string;

  @IsString()
  @IsOptional()
  category?: string;
}
