import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { SentimentService } from '../sentiment/sentiment.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ListLeadsQueryDto } from './dto/list-leads.query';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sentimentService: SentimentService,
    @InjectQueue('leads') private readonly leadsQueue: Queue,
  ) {}

  async createLead(dto: CreateLeadDto) {
    const payload = {
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      notes: dto.notes?.trim() || null,
    };

    // Generate Campaign ID with format: CMP-{YEAR}-{ID}
    const currentYear = new Date().getFullYear();
    const yearPrefix = `${currentYear}`;

    // Count leads created this year to generate sequential ID
    const leadsThisYear = await this.prisma.lead.count({
      where: {
        campaignId: {
          startsWith: `CMP-${yearPrefix}-`,
        },
      },
    });

    const nextId = (leadsThisYear + 1).toString().padStart(3, '0');
    const campaignId = `CMP-${yearPrefix}-${nextId}`;

    // Analyze sentiment dari notes (jika ada), bukan dari name
    let sentiment: string | null = null;
    if (payload.notes) {
      const result = await this.sentimentService.analyze(payload.notes);
      sentiment = result.sentiment;
    }

    await this.leadsQueue.add('lead.created', { ...payload, campaignId }, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 100,
    });

    const lead = await this.prisma.lead.create({
      data: {
        name: payload.name,
        email: payload.email,
        campaignId: campaignId,
        notes: payload.notes,
        sentiment: sentiment,
      },
    });

    return { lead, sentiment };
  }

  async listLeads(query: ListLeadsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.lead.count(),
      this.prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      data,
    };
  }
}
