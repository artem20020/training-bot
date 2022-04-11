const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5167900423:AAE5olqUMhetJrzN-elzJNtl1ERD4lIOiSk'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен отгадать!')
    const randomNumber = Math.floor( Math.random() * 10 )
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное привествие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра Угадай цифру'}
    ])
    
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
           await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/7e8/aa6/7e8aa67b-ad91-4d61-8f62-301bde115989/192/1.webp')
           return bot.sendMessage(chatId, `Добро пожаловать в телеграм бота`);
        }
        if(text === '/info') {
           return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if(text === '/game') {
           return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
      
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions),
            bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/7e8/aa6/7e8aa67b-ad91-4d61-8f62-301bde115989/192/3.webp')
        }else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадывал цифру ${chats[chatId]}`, againOptions),
            bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/7e8/aa6/7e8aa67b-ad91-4d61-8f62-301bde115989/192/4.webp')
        }

    })
    
}

start();