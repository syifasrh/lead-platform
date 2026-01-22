import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
    BullModule.registerQueue({ name: 'leads' }),
    QueuesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
