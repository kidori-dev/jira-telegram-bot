import {Body, Controller, Post} from '@nestjs/common';
import {TelegramService} from './telegram.service';
import {ConfigService} from '@nestjs/config';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly telegramService: TelegramService, private readonly configService: ConfigService) {
    }

    @Post('jira')
    async handleJiraWebhook(@Body() payload: any) {
        const event = payload.webhookEvent;

        switch (event) {
            case 'jira:issue_created':
                return this.handleIssueCreated(payload);

            case 'comment_created':
                return this.handleCommentCreated(payload);

            default:
                return {
                    ignored: true
                };
        }
    }

    private async handleIssueCreated(payload: any) {
        const issue = payload.issue;
        const user = payload.user;

        const jiraBaseUrl = this.configService.get<string>('JIRA_BASE_URL');
        const issueUrl = `${jiraBaseUrl}/browse/${issue.key}`;


        const message =
            `🎟 새로운 CS 티켓을 확인해주세요.\n` +
            `──────────────────\n` +
            `- Number: <a href="${issueUrl}">${issue.key}</a>\n` +
            `- Summary: ${issue.fields.summary}\n` +
            `- Reporter: ${user.displayName}\n` +
            `- Category: ${issue.fields.customfield_10074.value}\n` +
            `- Inquiry: ${issue.fields.customfield_10076}\n`

        await this.telegramService.sendMessage(message);
        return {success: true};
    }

    private async handleCommentCreated(payload: any) {
        const issue = payload.issue;
        const comment = payload.comment;
        const user = payload.user;

        const jiraBaseUrl = this.configService.get<string>('JIRA_BASE_URL');
        const issueUrl = `${jiraBaseUrl}/browse/${issue.key}`;

        const commentLimit =comment.body.length > 100 ? comment.body.slice(0, 100) : comment.body;

        const message =
            `💬 <a href="${issueUrl}">${issue.key}</a> 티켓에 새로운 댓글이 달렸습니다.\n` +
            `──────────────────\n` +
            `- Number: <a href="${issueUrl}">${issue.key}</a>\n` +
            `- Author: ${comment.author.displayName}\n`+
            `- Comment: ${commentLimit}`

        await this.telegramService.sendMessage(message);

        return {success: true};
    }
}