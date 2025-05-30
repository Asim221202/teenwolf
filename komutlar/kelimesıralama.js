const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'sıralama',
  description: 'RolePlay Üye rolündeki kullanıcıların kelime sayısına göre sıralar.',
  async execute(message) {
    const filePath = './data/kelimeVerisi.json';
    const roleName = 'RolePlay Üye';

    if (!fs.existsSync(filePath)) {
      return message.reply('Kelime veritabanı bulunamadı.');
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const role = message.guild.roles.cache.find(r => r.name === roleName);
    if (!role) return message.reply(`**${roleName}** rolü bulunamadı.`);

    // Sunucudaki tüm üyeleri cache'e al (rol kontrolü için gerekli)
    await message.guild.members.fetch();

    const users = [];

    for (const [userId, userData] of Object.entries(data)) {
      const words = userData.words || 0;
      if (words <= 0) continue;

      const member = message.guild.members.cache.get(userId);
      if (!member) continue; // Sunucudan çıkmış olabilir
      if (!member.roles.cache.has(role.id)) continue; // Role sahip değilse atla

      users.push({
        userId,
        words
      });
    }

    // Kelime sayılarına göre sırala
    const sortedUsers = users.sort((a, b) => b.words - a.words);

    const topUsers = sortedUsers.slice(0, 10);

    const topList = await Promise.all(
      topUsers.map(async (user, index) => {
        const member = message.guild.members.cache.get(user.userId);
        const username = member ? member.user.username : 'Bilinmeyen Kullanıcı';
        return `${index + 1}. ${username} - ${user.words} kelime`;
      })
    );

    const yourIndex = sortedUsers.findIndex(u => u.userId === message.author.id);
    const yourRank = yourIndex !== -1 ? yourIndex + 1 : null;
    const yourWords = data[message.author.id]?.words || 0;

    const embed = new MessageEmbed()
      .setColor('#ffffff')
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setTitle('**༒ Kelime Sıralaması**')
      .setDescription(topList.join('\n') || 'Liste boş.')
      .setFooter({ text: yourRank ? `༒ | Senin sıran: ${yourRank}. - ${yourWords} kelime` : '༒ | Sıralamada değilsin.' })
      

    return message.channel.send({ embeds: [embed] });
  },
};