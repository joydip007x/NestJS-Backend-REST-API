/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async editUser(userId: string, dto: EditUserDTO) {
     
    const user = await this.prisma.user.update({
        where: {
            id: userId
        },
        data: {
            ...dto,
        }
    });
    delete user.password;
    delete user.refresh_Token;
    return user;
  }
}
