import * as Bot from 'node-telegram-bot-api';
import {IteleramListneers} from './typings';

class TelegramBot {
    protected token: string;
    protected api: Bot;

    constructor(token: string) {
        this.token = token;
        this.api = new Bot(this.token, {polling: true});
    }

    public addStrictListeners(listeners: IteleramListneers) {
        this.api.on('message', (msg: Bot.Message) => {
            const {chat, text} = msg;

            this.api.sendMessage(chat.id, text && listeners[text] ? listeners[text] : 'Не нашёл ответ..');
        });
    }

    public addRegexListeners(regexp: RegExp, listeners: IteleramListneers) {
        this.api.onText(regexp, (msg: Bot.Message, match: RegExpExecArray | null) => {
            if (match && match.length > 1) {
                const chatId = msg.chat.id;
                const resp = match[1];

                this.api.sendMessage(chatId, listeners[resp] ? listeners[resp] : 'Не нашёл ответ...');
            }
        });
    }

    public sendToMe(text: string) {
        this.api.sendMessage('674525070', text);
    }
}

export default TelegramBot;
