import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SentimentService {
  constructor(private readonly httpService: HttpService) {}

  async analyze(text: string) {
    const baseUrl = process.env.SENTIMENT_URL ?? 'http://localhost:8000';
    const response = await firstValueFrom(
      this.httpService.post(`${baseUrl}/sentiment`, { text }),
    );

    return response.data as { sentiment: string };
  }
}
