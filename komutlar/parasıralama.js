const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "zenginler",
  description: "Kullanıcıların toplam bakiyelerine göre sıralama yapar.",
  async execute(message) {
    const filePath = path.join(__dirname, '../data', 'balances.json');

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
      return message.reply("Veritabanı dosyası bulunamadı, yeni dosya oluşturuldu.");
    }

    // Veritabanını okuma
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Kullanıcıların toplam bakiyelerini hesapla
    const users = await Promise.all(
      Object.keys(data).map(async (userId) => {
        const user = data[userId];
        const balance = user.balance || 0; // Eksik `balance` için varsayılan 0
        const bank = user.bank || 0; // Eksik `bank` için varsayılan 0
        const totalBalance = balance + bank;

        const member = await message.guild.members.fetch(userId).catch(() => null);

        return {
          username: member ? member.user.username : null, // Kullanıcı bulunamazsa null döner
          totalBalance,
        };
      })
    );

    // Kullanıcıları toplam bakiyeye göre sıralama
    const sortedUsers = users
      .filter((user) => user.username && user.totalBalance > 0) // Bilinmeyen kullanıcılar ve bakiyesi 0 olanları ele
      .sort((a, b) => b.totalBalance - a.totalBalance) // Toplam bakiyeye göre sıralama
      .slice(0, 10); // İlk 10 kullanıcıyı al

    // Sıralama listesini oluştur
    const ranking = sortedUsers
      .map((user, index) => `${index + 1}. ${user.username} - ${user.totalBalance} `)
      .join("\n");

    if (!ranking) {
      return message.reply("Hiçbir kullanıcının bakiyesi bulunmuyor.");
    }

    // Embed oluşturma
    const embed = new MessageEmbed()
      .setColor('#ffffff')
      .setTitle('**༒Para Sıralaması༒**')
      .setDescription(ranking)
      .setFooter('Toplam bakiyeye göre sıralama.')
      .setTimestamp();

    // Embed gönderme
    return message.channel.send({ embeds: [embed] });
  },
};