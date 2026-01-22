import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { SentimentModule } from './sentiment/sentiment.module';

@Module({
  imports: [PrismaModule, QueueModule, SentimentModule, LeadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
