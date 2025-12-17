import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {ConfigService} from '@nestjs/config';
import https from 'https';

@Injectable()
export class TelegramService {
    constructor(private config: ConfigService) {
    }


    async sendMessage(message: string) {
        const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
        const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');
        const axiosInstance = axios.create({
            timeout: 5000,
            httpsAgent: new https.Agent({
                keepAlive: true,
                maxSockets: 50,
            }),
        });

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        for (let attempt = 1; attempt <= 5; attempt++) {
            try {
                await axiosInstance.post(url, {
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                });
                return;
            } catch (err) {
                if (attempt === 5) throw err;
                // 대기
                await new Promise(r => setTimeout(r, attempt * 1000));
            }
        }
    }
}