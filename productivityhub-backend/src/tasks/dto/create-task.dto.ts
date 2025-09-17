import { IsString, IsOptional, IsBoolean, IsDateString, IsIn, IsArray, IsNumber, Min, Max } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsString()
  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsDateString()
  @IsOptional()
  reminder?: Date;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}