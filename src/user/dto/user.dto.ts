import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDTO {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  refresh_Token?: string;
}
