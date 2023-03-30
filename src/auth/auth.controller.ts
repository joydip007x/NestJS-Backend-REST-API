import { Controller, Post, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from '@nestjs/common';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
