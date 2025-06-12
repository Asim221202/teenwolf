const { MessageEmbed } = require('discord.js');
const WeeklyWords = require('../models/WeeklyWords'); // Yolunu senin dizinine göre ayarla

module.exports = {
  name: 'hsıralama',
  description: 'RolePlay Üye rolündeki kullanıcıların haftalık kelime sayısına göre sıralar.',
  async execute(message) {
    const roleName = 'RolePlay Üye';

    const role = message.guild.roles.cache.find(r => r.name === roleName);
    if (!role) return message.reply(`**${roleName}** rolü bulunamadı.`);

    // Sunucudaki tüm üyeleri cache'e al
    await message.guild.members.fetch();

    let users = [];

    try {
      // Veritabanından tüm kullanıcıları kelime sayısına göre sırala
      const allData = await WeeklyWords.find({ words: { $gt: 0 } }).sort({ words: -1 });

      for (const entry of allData) {
        const member = message.guild.members.cache.get(entry._id);
        if (!member || !member.roles.cache.has(role.id)) continue;

        users.push({
          userId: entry._id,
          words: entry.words
        });
      }

      // İlk 10 kullanıcıyı al
      const topUsers = users.slice(0, 10);

      const topList = await Promise.all(
        topUsers.map(async (user, index) => {
          const member = message.guild.members.cache.get(user.userId);
          const username = member ? member.user.username : 'Bilinmeyen Kullanıcı';
          return ` ${index + 1}. ${username} - ${user.words} kelime`;
        })
      );

      // Kendi sırasını bul
      const yourIndex = users.findIndex(u => u.userId === message.author.id);
      const yourRank = yourIndex !== -1 ? yourIndex + 1 : null;
      const yourData = await WeeklyWords.findById(message.author.id);
      const yourWords = yourData?.words || 0;

      const embed = new MessageEmbed()
        .setColor('#ffffff')
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setTitle('**༒ Haftalık Kelime Sıralaması**')
        .setDescription(topList.join('\n') || 'Liste boş.')
        .setFooter({ text: yourRank ? `༒ | Senin haftalık sıran: ${yourRank}. - ${yourWords} kelime` : '༒ | Sıralamada değilsin.' });

      return message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error('Veritabanı hatası:', err);
      return message.reply('Veritabanından veri alınırken bir hata oluştu.');
    }
  },
};
