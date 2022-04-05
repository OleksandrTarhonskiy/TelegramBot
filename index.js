const TelegramBotAPI = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBotAPI(process.env.TOKEN, { polling: true });

const fakeDB = {};
const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: 1 }, { text: '2', callback_data: 2 }, { text: '3', callback_data: 3 }],
            [{ text: '4', callback_data: 4 }, { text: '5', callback_data: 5 }, { text: '6', callback_data: 6 }],
            [{ text: '7', callback_data: 7 }, { text: '8', callback_data: 8 }, { text: '9', callback_data: 9 }],
            [{ text: '0', callback_data: 0 }],
        ]
    }),
};

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Play again', callback_data: '/again' }],
        ]
    }),
};

const playGame = async(chatId) => {
    await bot.sendMessage(chatId, 'guess num 0 to 9');
    const randomNum = Math.floor(Math.random() * 10);
    fakeDB[chatId] = randomNum;
    await bot.sendMessage(chatId, 'Lets start', gameOptions);
    return;
};

bot.setMyCommands([
    { command: '/start', description: 'start bot' },
    { command: '/info', description: 'get info' },
    { command: '/game', description: 'start game' },
]);

bot.on('message', async ({ from, chat, text }) => {
    if (text === '/start') {
        await bot.sendMessage(chat.id, `Hi, ${from.first_name}!`);
        await bot.sendSticker(chat.id, 'https://tlgrm.ru/_/stickers/b48/7e2/b487e222-21cd-4741-b567-74b25f44b21a/1.webp');
        return;
    }

    if (text === '/game') await playGame(chat.id);

    return bot.sendMessage(chat.id, 'unknown command');
});

bot.on('callback_query', ({ message, data }) => {
    if (data === '/again') return playGame(message.chat.id);
    if (+data === +fakeDB[message.chat.id]) return bot.sendMessage(message.chat.id, 'You win!', againOptions);
    return bot.sendMessage(message.chat.id, ':(', againOptions);
});