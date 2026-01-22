import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('leads')
export class LeadsProcessor extends WorkerHost {
  async process(job: Job<{ email: string }>) {
    const email = job.data.email;
    console.log(`Lead received: ${email}`);
  }
}
