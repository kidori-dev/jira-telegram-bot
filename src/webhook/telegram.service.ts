import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class TelegramService {
    constructor(private config: ConfigService) {
    }


    async sendMessage(message: string) {
        const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
        const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');

        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
    }
}