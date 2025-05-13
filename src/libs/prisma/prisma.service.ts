import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'production') {
      // Only allow this in non-production environments
      const models = Reflect.ownKeys(this).filter(
        (key) =>
          typeof key === 'string' &&
          !key.startsWith('_') &&
          key !== '$connect' &&
          key !== '$disconnect',
      );

      return Promise.all(
        models.map(async (modelKey) => {
          if (
            typeof modelKey === 'string' &&
            this[modelKey] &&
            typeof this[modelKey].deleteMany === 'function'
          ) {
            await this[modelKey].deleteMany();
          }
        }),
      );
    }
  }
}
