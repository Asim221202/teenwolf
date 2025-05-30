module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Mesajları kontrol etmek için basit bir örnek
    if (message.content === '!ping') {
      await message.reply('Pong! 🏓');
    }
  },
};