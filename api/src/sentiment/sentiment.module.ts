import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SentimentService } from './sentiment.service';

@Module({
  imports: [HttpModule],
  providers: [SentimentService],
  exports: [SentimentService],
})
export class SentimentModule {}
