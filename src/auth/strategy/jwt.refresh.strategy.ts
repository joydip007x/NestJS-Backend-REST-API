/* eslint-disable prettier/prettier */
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"; 
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy,'jwt-refresh') {

    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload :any ): Promise<any> {

        // console.log('GUARDS FIRST ',/*payload,*/ " ::\n", req);

        // const Token=payload.get('authorization').replace('Bearer','').trim();
        // console.log(Token);

        const refresh_Token= req.get('authorization').replace('Bearer','').trim();
        console.log('\nPrinting refresh token : '+refresh_Token);

        return {...payload,refresh_Token };
    }   
}