import { Module } from '@nestjs/common';
import { QueueModule } from '../queue/queue.module';
import { SentimentModule } from '../sentiment/sentiment.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [QueueModule, SentimentModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
