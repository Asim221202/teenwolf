const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'çekilişbitir',
  description: 'Çekilişi bitirir ve kazananları açıklayarak dosyaya kaydeder.',
  async execute(message, args) {
    // Çekiliş bitir komutunun izin kontrolü
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('Bu komutu kullanmak için yönetici iznine sahip olmalısınız.');
    }

    // Katılımcı verisini okuma
    if (!fs.existsSync('participants.json')) {
      return message.reply('Henüz çekiliş başlamadı veya katılımcı verisi bulunamadı.');
    }

    const participants = JSON.parse(fs.readFileSync('participants.json', 'utf-8'));

    if (participants.length === 0) {
      return message.reply('Çekilişe katılan kimse yok.');
    }

    // Kazananları seç
    const numberOfWinners = parseInt(args[0]) || 1; // Kazanan sayısını argümandan al, varsayılan olarak 1 al
    let winners = [];

    for (let i = 0; i < Math.min(numberOfWinners, participants.length); i++) {
      const winner = participants[Math.floor(Math.random() * participants.length)];
      winners.push(winner);
      participants.splice(participants.indexOf(winner), 1); // Aynı kişi kazandığında tekrar seçilmesin
    }

    const winnerMentions = winners.map(id => `<@${id}>`).join(', ');

    // Çekiliş bitiş mesajını gönder
    await message.channel.send(`Çekiliş bitti! Kazananlar: ${winnerMentions}`);

    // Çekiliş verisini sıfırla (katılımcıları temizle)
    fs.writeFileSync('participants.json', JSON.stringify([], null, 2), 'utf-8');
  },
};