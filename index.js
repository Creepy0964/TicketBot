const TelegramBot = require('node-telegram-bot-api'); // библиотека для работы с Telegram
const fs = require('fs'); // библиотека для работы с файлами
let ticket = fs.readFileSync('ticket.txt', 'utf8'); // в корневой папке бота ОБЯЗАТЕЛЬНО должны присутствовать ticket.txt и banlist.txt
let ticket_var = 0; // временная проверка для числа тикета 
let isBanned = false; // проверка на бан

// некоторые строки команд повторяются, прошу смотреть код команды /report

console.log('Starting...');

const token = '';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/helpReport/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Чтобы отправить жалобу, напишите /report [сообщение]. Пример: ');
    bot.sendPhoto(chatId, 'example.png'); // отправляем пример команды
});

bot.onText(/\/info/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'TicketBot, версия: 1.0.0. Разработано @creepy0964 для @tpn_conf.');
});

bot.onText(/\/clearDatabase/, (msg) => {
    if(msg.from.username != '') return; // в похожие поля вставить свой юзернейм (@username)
    const chatId = msg.chat.id;
    fs.writeFile('ticket.txt', '0', function (err) {
        if (err) throw err;
        console.log(ticket);
    });
    ticket = 0;
    ticket_var = 0;
    bot.sendMessage(chatId, 'Done.');
});

bot.onText(/\/ban (.+)/, (msg, match) => {
    if(msg.from.username != '') return;
    isBanned = false;
    const chatId = msg.chat.id;
    const something = '';
    const resp = match[1];
    const banList = fs.readFileSync('banlist.txt', 'utf8');
    banList.split(/\r?\n/).forEach(line => {
        if(resp === line) { bot.sendMessage(chatId, 'Already banned.'); isBanned = true; }
    });
    if(isBanned !== true) {
        fs.appendFileSync('banlist.txt', '\n' + resp.toString()); // добавление строки в банлист
        bot.sendMessage(chatId, 'Done.');
        isBanned = false;
    }
});

bot.onText(/\/report (.+)/, (msg, match) => {
    isBanned = false; // проверка на бан
    const banList = fs.readFileSync('banlist.txt', 'utf8'); // получение банлиста
    const chatId = msg.chat.id; // получение ID чата, где была введена команда
    const something = ''; // сюда вставить ваш TG ID цифрами для того, чтобы репорты приходили вам
    const resp = match[1]; // получение аргументов команды в отдельную переменную
    banList.split(/\r?\n/).forEach(line => {
        line_var = parseInt(line); // переведение строк из файла в числовой формат
        if(msg.from.id === line_var) { bot.sendMessage(chatId, 'Вы заблокированы в системе Ticket Bot. По всем вопросам обращаться к Администрации.'); isBanned = true; } // защита от дурака
    });
    if(isBanned !== true) {
        bot.sendMessage(chatId, "Отправлено! Администрация свяжется с вами в скором времени."); // сообщение об успешной отправке репорта
        ticket++; // повышение значения тикета
        fs.writeFile('ticket.txt', ticket.toString(), function (err) { // пишем в базу данных новое значение тикета
            if (err) throw err;
        });
        ticket_var = parseInt(fs.readFileSync('ticket.txt', 'utf8')); //  вынимаем из базы данных новое значение тикета (да, костыль. да, говнокод. починю позже :p)
        bot.sendMessage(something, `Поступил новый тикет. Номер тикета: ${ticket_var}. Обращается: @${msg.from.username} (${msg.from.id}).\nЖалоба: ${resp}`); // тикет пришел
        isBanned = false; // отключение проверки на бан
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg.text + " recieved from " + chatId + ' by ' + msg.from.id); // лог сообщений
});

bot.on("polling_error", console.log); // лог ошибок