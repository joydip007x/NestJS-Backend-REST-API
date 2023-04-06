/* eslint-disable prettier/prettier */
import { 
Body,Controller, Get, 
Patch, Req, UseGuards
} 
from '@nestjs/common';

import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { EditUserDTO } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

  constructor(private userService: UserService){}

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch()
  editUser(@GetUser('id') userId:string, @Body() dto:EditUserDTO){

    return this.userService.editUser(userId, dto);
  }

  
}
