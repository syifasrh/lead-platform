import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ListLeadsQueryDto } from './dto/list-leads.query';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  createLead(@Body() dto: CreateLeadDto) {
    return this.leadsService.createLead(dto);
  }

  @Get()
  listLeads(@Query() query: ListLeadsQueryDto) {
    return this.leadsService.listLeads(query);
  }
}
