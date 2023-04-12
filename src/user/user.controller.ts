/* eslint-disable prettier/prettier */
import { 
Body,Controller, Get, 
Patch, Post, Req, UseGuards
} 
from '@nestjs/common';

import { Request } from 'express';
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
  
    return {'user':req.user,'session':req.session};
  }

  
  @Post('me')
  @UseGuards(JwtGuard)
  getNewMe( @Req() req:Request){
      
    console.log('**Matching CSRF**\n',req.body.csrf ,"\n", req.session.csrf);
    if( !req.body.csrf || !req.session.csrf || req.body.csrf !== req.session.csrf) 
      return "CSRF token invalid.";
      
    return {'user':req.user};
  }

  /* Extended code block to test CSRF */
  ////////////////////////////////////
  @Get('meew')
  @UseGuards(JwtGuard)
  getMeNew( @Req() req:Request) {
    
    console.log('Req USER ',req.user);
    if (req.session.csrf === undefined) {
      req.session.csrf = randomBytes(100).toString('base64'); // convert random data to a string
    }  
    console.log('Req Token ME-EW',req.session.csrf);
  
    return {'user':req.user,'session':req.session};
  }


  @Post('meew')
  @UseGuards(JwtGuard)
  getNewMeNew( @Req() req:Request){
      
    console.log('**Matching CSRF ME-EW**\n',req.body.csrf ,"\n", req.session.csrf);
    if( !req.body.csrf || !req.session.csrf || req.body.csrf !== req.session.csrf) 
      return "CSRF token invalid.";
    
    return {'user':req.user};
  }

  /*                                                             */
  ////////////////////////////Extended ////////////////////////////

  @UseGuards(JwtGuard)
  @Patch()
  editUser(@GetUser('id') userId:string, @Body() dto:EditUserDTO){

    return this.userService.editUser(userId, dto);
  }

  
}
