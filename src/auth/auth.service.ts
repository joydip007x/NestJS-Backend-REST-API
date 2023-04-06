/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, TokenAuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
 
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    ) {}

  async signup(dto: AuthDto) {
    //generate password hash
    const hash = await argon.hash(dto.password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
        select: {
          id: true,
          email: true,
        },
      });
      //const tokens=await this.getTokens(newUser);

     /// RETURN TOKENS or  NEW USER //
      return newUser; 

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // eslint-disable-next-line prettier/prettier
          throw new ForbiddenException('Duplicate Credentials');
        } else {
          throw error;
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid Credentials');
    }
    const passwordValid = await argon.verify(user.password, dto.password);
    if (!passwordValid) {
      throw new ForbiddenException('Invalid Password');
    }
    delete user.password;
    const tokens=await this.getTokens(user);

    return tokens;
  }

  async logout(dto : TokenAuthDto) {
     
     await this.prisma.user.updateMany({
      where: {
        id:dto.id,
        refresh_Token:{
          not:null,
        },
      },
      data:{
        refresh_Token:null,
      }
     })

    return "Logged Out ";

  }
  async getTokens(dto: TokenAuthDto){

    const signInToken= await this.getSignToken(dto);
    const refreshToken=await this.getRefreshToken(dto);

    console.log('RefreshToken-Service: ',refreshToken);
    return {signInToken,refreshToken};
  }

  async getSignToken( dto: TokenAuthDto ): Promise<string >{
    const payload = {   ///userId: string,email: string
      id: dto.id, 
      email:dto.email,
    }
    const secret= this.config.get('JWT_SECRET');

    const token= await  this.jwt.signAsync(payload,{
      expiresIn:'15m',
      secret
    })
    return token;
  }

  
  async getRefreshToken(dto: TokenAuthDto): Promise<string> {
    console.log('Refreshing token service: ',dto);
    const payload = {  
      id: dto.id, 
      email:dto.email,
    }
    const secret= this.config.get('JWT_REFRESH_SECRET');

    const token= await  this.jwt.signAsync(payload,{
      expiresIn:'7d',
      secret
    })
    await this.updateDBRefreshTokenHash(dto, token)
    return token;
  } 
  
  async refreshToken(dto: TokenAuthDto, refresh_Token: string){
    
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.id,
      },
      select:{
        id:true,
        refresh_Token:true,
      }
    });
    if (!user || !user.refresh_Token ) {
      throw new ForbiddenException('Invalid Credentials');
    }

    console.log(user.refresh_Token, refresh_Token);

    if ( !argon.verify(user.refresh_Token,refresh_Token) ) {
      throw new ForbiddenException('Invalid Credentials');
    }
    return await this.getTokens( dto);
  }

  async updateDBRefreshTokenHash(dto: TokenAuthDto, refreshToken: string){

    const hashedToken=await this.hash(refreshToken);
    await this.prisma.user.update({
      where:{ id: dto.id},
      data: {refresh_Token : hashedToken}
    });

    return 'Refresh Token has been updated successfully';
  }

  hash( data : string){
    return  argon.hash(data);
  }
}
