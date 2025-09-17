import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  notebook?: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;
}