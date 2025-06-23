import {Controller, Post, Body, UseFilters, Logger} from '@nestjs/common';
import { AppService } from './app.service';
import {GptExceptionFilter} from "./filter/gpt.exception.filter";

@Controller('chat')
@UseFilters(GptExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger: Logger = new Logger(AppController.name);

  @Post()
  async handleChat(@Body() body: { text?: string; image?: string }): Promise<string> {
    this.logger.debug("Поступил запрос в ChatGPT.")

    const { text, image } = body;
    return await this.appService.getChatResponse(text, image);
  }
}
