/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import * as cookieSession from 'cookie-session';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
// });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //comments here
    }),
  );
 // app.use(cors());
  app.use(cookieParser());

  app.use(cookieSession({
    name: 'session',                              // name of the cookie
    secret: 'MAKE_THIS_SECRET_SECURE',            // key to encode session
    maxAge: 60 * 1000,                  // cookie's lifespan
    sameSite: 'lax',                              // controls when cookies are sent
    path: '/',                                    // explicitly set this for security purposes
   // secure: true, // cookie only sent on HTTPS
    httpOnly: true                                // cookie is not available to JavaScript (client)
  }));


  await app.listen(3000);
}
bootstrap();
