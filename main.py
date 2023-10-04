import telebot

token = '6560106626:AAGrRgHOaPJbMG3TIctF74Nv-vBV3Zn_5dI' # сюда токен
admin_id = '' # сюда числовой id телеграма (можно узнать через @userinfobot)

bot = telebot.TeleBot(token)

def extract_arg(arg):
    return arg.split()[1:]

@bot.message_handler(commands=['start'])

def start_message(message):
    bot.send_message(message.chat.id, "тест")

@bot.message_handler(commands=['helpReport'])

def helpReport(message):
    f = open('./example.jpg', 'rb')
    bot.send_message(message.chat.id, "Чтобы отправить жалобу, напишите /report [сообщение]. Пример: ")
    bot.send_photo(message.chat.id, f)

@bot.message_handler(commands=['report'])

def report_command(message):
    resp = extract_arg(message.text)
    sep = ' '
    x = sep.join(resp)
    if x == '':
        bot.send_message(message.chat.id, 'Неверный синтаксис. Инструкция, как отправить жалобу — /helpReport')
        return
    bot.send_message(message.chat.id, 'Отправлено! Администрация свяжется с вами в скором времени.')
    bot.send_message(admin_id, f'Поступил новый тикет. Номер тикета: none. Обращается: @{message.from_user.username} ({message.from_user.id}).\nЖалоба: {x}')

@bot.message_handler(content_types='text')
def message_reply(message):
    if message.text == '/report':
        bot.send_message(message.chat.id, 'Неверный синтаксис. Инструкция, как отправить жалобу — /helpReport')

bot.infinity_polling()