import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async handleChat(@Body() body: { text?: string; image?: string }): Promise<string> {
    const { text, image } = body;
    return await this.appService.getChatResponse(text, image);
  }
}
