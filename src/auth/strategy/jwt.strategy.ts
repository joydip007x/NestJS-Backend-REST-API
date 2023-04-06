/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt',) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload:any ){

    // console.log('Access Token.Strategy : '+payload);
    // let str = JSON.stringify(payload);
    // str = JSON.stringify(payload, null, 4); // (Optional) beautiful indented output.
    // console.log(str);

    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      select:{
        email: true,
        id: true,
      }
    })
    console.log("\nFirst Guard Will be Checked: ",user,"\nGuard-Payload: ",payload);
    return user;
  }
  

}
