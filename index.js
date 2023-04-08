const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');

const token = '5940715457:AAFqqbjbifENF5c7VZpoSZbpJ1uxgoyQtmE';

const bot = new TelegramApi(token, {polling: true});

const chats = {}



const startGame = async chatId => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    return bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра'},
    ])
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/d16/c31/d16c31cb-5b84-4b85-aff1-b88713d649c9/192/1.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в тегелрам бот`);
        }
        
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if(text === '/game') {
            return startGame(chatId);
        }



        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуйте еще раз!)');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if(data === 'again') {
            return startGame(chatId);
        }

        if(data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю ты угадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Поздравляю ты не угадал цифру ${chats[chatId]}`, againOptions);
        }
    });
}

start();