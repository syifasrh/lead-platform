import { Module } from '@nestjs/common';
import { LeadsProcessor } from './leads.processor';

@Module({
  providers: [LeadsProcessor],
})
export class QueuesModule {}
