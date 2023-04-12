/* eslint-disable prettier/prettier */
import { Controller, Post, Req, Body, Get, UseGuards, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto, TokenAuthDto } from './dto';
import { JwtGuard, RefreshTokenGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto, @Res() res:Response) {
    
    console.log('auth.controllers.signin : ', dto);
    const data=await this.authService.signin(dto);
    res.cookie('jwt-token',data.signInToken)
    res.cookie('jwt-refresh-token',data.refreshToken);
    return res.send("Success");
    //return this.authService.signin(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  logout(@Req() req:Request){
    // console.log('Logout Controller',req.user);
    const dto =  TokenAuthDto.toDTO(req.user);
    return this.authService.logout(dto);
  }
  
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Req() req:Request ){

    console.log('Refresh Route Req : ', req.user);
    const dto =  TokenAuthDto.toDTO(req.user);
    return this.authService.refreshToken( dto, req.user.refresh_Token);
  }
}
