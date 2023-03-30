import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'mongodb+srv://admin:admin@cluster0.v0nfetm.mongodb.net/abcdDB?retryWrites=true&w=majority',
        },
      },
    });
  }
}
