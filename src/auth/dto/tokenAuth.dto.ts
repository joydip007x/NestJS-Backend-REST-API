import { IsEmail, IsNotEmpty } from 'class-validator';

export class TokenAuthDto {
  static toDTO(domain: TokenAuthDto) {
    return {
      email: domain.email,
      id: domain.id,
    };
  }
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  id: string;

  //refresh_Token: string;
}
