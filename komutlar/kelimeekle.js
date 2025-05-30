const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'kelimeekle',
  description: 'Bir kullanıcıya belirli miktarda kelime ekler.',
  async execute(message, args) {
    // Komutun sadece belirli bir role sahip kullanıcılar tarafından kullanılmasını sağla
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('Bu komutu kullanmak için yönetici yetkisine sahip olmanız gerekiyor.');
    }

    // Komutun doğru kullanıldığından emin olalım (Kullanıcı ve kelime miktarı)
    if (args.length < 2) {
      return message.reply('Lütfen bir kullanıcı ve eklemek istediğiniz kelime miktarını belirtin.');
    }

    // Kullanıcıyı al
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('Geçerli bir kullanıcı belirtmelisiniz.');
    }

    // Kelime miktarını al
    const wordAmount = parseInt(args[1], 10);
    if (isNaN(wordAmount) || wordAmount <= 0) {
      return message.reply('Lütfen geçerli bir kelime miktarı girin.');
    }

    // Kelime verisi dosyasını oku
    const kelimeVerisiPath = path.join(__dirname, '../data', 'kelimeVerisi.json');
    let kelimeData = {};

    if (fs.existsSync(kelimeVerisiPath)) {
      kelimeData = JSON.parse(fs.readFileSync(kelimeVerisiPath, 'utf8'));
    }

    // Kullanıcıyı veriye ekle veya mevcut veriyi güncelle
    const userId = user.id;
    if (!kelimeData[userId]) {
      kelimeData[userId] = {
        words: 0, // Kullanıcının toplam kelime sayısı
      };
    }

    // Kelime miktarını ekle
    kelimeData[userId].words += wordAmount;

    // Veriyi kaydet
    fs.writeFileSync(kelimeVerisiPath, JSON.stringify(kelimeData, null, 2));

    // Embed mesajı oluştur
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Kelime Ekleme Başarılı')
      .setDescription(`${user.username} kullanıcısına ${wordAmount} kelime eklendi.`)
      .setFooter('Kelime sayısı güncellendi.')
      .setTimestamp();

    // Mesajı gönder
    return message.channel.send({ embeds: [embed] });
  },
};