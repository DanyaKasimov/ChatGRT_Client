import { Injectable } from '@nestjs/common';
import {OpenaiClient} from "./client/openai.client";

@Injectable()
export class AppService {
  constructor(private readonly openaiClient: OpenaiClient) {}

  public async getChatResponse(text?: string, image?: string): Promise<string> {
    if (image && text) {
      return await this.openaiClient.analyzeImage(image, text);
    }
    if (text) {
      return await this.openaiClient.sendText(text);
    }
    return 'Неверный формат запроса';
  }
}