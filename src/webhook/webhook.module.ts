import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { TelegramService } from './telegram.service';

@Module({
    controllers: [WebhookController],
    providers: [TelegramService],
})
export class WebhookModule {}