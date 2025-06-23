import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { OpenaiClient } from './client/openai.client';

@Module({
  controllers: [AppController],
  providers: [AppService, OpenaiClient],
})
export class AppModule {}