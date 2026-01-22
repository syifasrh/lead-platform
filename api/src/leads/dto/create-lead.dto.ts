import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @Length(2, 120)
  name: string;

  @IsEmail()
  @Length(5, 255)
  email: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  notes?: string;
}
