import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenaiClient {
    private readonly openai: OpenAI;
    private static readonly MODEL = 'gpt-4.1';
    private static readonly BASE_URL = 'https://api.proxyapi.ru/openai/v1';
    private static readonly MAX_TOKENS = 10000;
    private history: ChatCompletionMessageParam[] = [];

    constructor() {
        this.openai = new OpenAI({
            apiKey: "",
            baseURL: OpenaiClient.BASE_URL,
        });
    }

    public async analyzeImage(imageBase64: string, prompt: string): Promise<string> {
        const message: ChatCompletionMessageParam = {
            role: 'user',
            content: [
                { type: 'text', text: prompt },
                {
                    type: 'image_url',
                    image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
                },
            ],
        };

        this.history.push(message);

        const response = await this.openai.chat.completions.create({
            model: OpenaiClient.MODEL,
            messages: this.history,
            max_tokens: OpenaiClient.MAX_TOKENS,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('Пустой ответ от OpenAI');

        this.history.push({ role: 'assistant', content });
        return content;
    }

    public async sendText(text: string): Promise<string> {
        const message: ChatCompletionMessageParam = {
            role: 'user',
            content: text,
        };

        this.history.push(message);

        const response = await this.openai.chat.completions.create({
            model: OpenaiClient.MODEL,
            messages: this.history,
            max_tokens: OpenaiClient.MAX_TOKENS,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('Пустой ответ от OpenAI');

        this.history.push({ role: 'assistant', content });
        return content;
    }
}
