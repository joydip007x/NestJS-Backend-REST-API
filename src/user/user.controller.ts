/* eslint-disable prettier/prettier */
import { 
Body,Controller, Delete, Get, 
Patch, Post, Req, Res, UseGuards
} 
from '@nestjs/common';

import { Request,Response } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { EditUserDTO } from './dto';
import { UserService } from './user.service';
import { randomBytes } from 'crypto';


@Controller('users')
export class UserController {

  constructor(private userService: UserService){}

  @Get('me')
  @UseGuards(JwtGuard)
  getMe( @Req() req:Request) {
    
    console.log('Req USER ',req.user);
    if (req.session.csrf === undefined) {
      req.session.csrf = randomBytes(100).toString('base64'); // convert random data to a string
    }  
    console.log('Req Token ',req.session.csrf);
  
    return {
      'user':req.user,
      'session':req.session
    };
  }

  @Post('me')
  @UseGuards(JwtGuard)
  getNewMe( @Req() req:Request){
      
    console.log('Matching CSRF ',req.body.csrf ,"\n", req.session.csrf);
    return (req.body.csrf !== req.session.csrf);
  }

  @UseGuards(JwtGuard)
  @Patch()
  editUser(@GetUser('id') userId:string, @Body() dto:EditUserDTO){

    return this.userService.editUser(userId, dto);
  }

  @Delete('token')
  getCsrfToken(@Req() req) {
    return req
  }

  
}
