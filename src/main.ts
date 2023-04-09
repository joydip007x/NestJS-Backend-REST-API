/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';


import * as cookieSession from 'cookie-session';
import * as cookieParser from 'cookie-parser';
// import * as cookieParser from 'cookie-parser';
import {CSRFValidator} from 'csrf-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //comments here
    }),
  );

  /// app.use(cookieParser('Cookie secret key for cookie-parser'));
  app.use(cookieSession({
    name: 'session',
    keys: [
      'First session key for cookie-session',
      'Second session key for cookie-session'
    ],
    maxAge:  10 * 1000,
  }));

  // app.useGlobalFilters(new CsrfFilter);
  //app.use(cookieParser());
  CSRFValidator.instance(
    {
      tokenSecretKey: 'A_secret_key_for_encrypting_csrf_token',
      ignoredMethods: [/*'GET'*/ /*'POST'*/],
      ignoredRoutes: ['/auth/signin','/auth/logout'],
      entryPointRoutes: ['/auth/signin'],
      cookieKey: 'csrf',
      cookieSecretKey: 'Cookie secret key for cookie-parser',
      cookieSessionKeys: [
        'First session key for cookie-session',
        'Second session key for cookie-session'
      ]
    }
).configureApp(app);
  
  await app.listen(3000);
}
bootstrap();
