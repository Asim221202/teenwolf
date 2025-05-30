const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'sunucu',
  description: 'Sunucu bilgilerini gösterir.',
  execute: async (message) => {
    const { guild } = message;

    if (!guild) {
      return message.channel.send('Bu komut yalnızca bir sunucuda kullanılabilir.');
    }

    // Sunucu bilgilerini al
    const totalMembers = guild.memberCount;
    const botCount = guild.members.cache.filter(member => member.user.bot).size; // Botları doğru şekilde say
    const userCount = totalMembers - botCount;
    const roleCount = guild.roles.cache.size;
    const textChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size;
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
    const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`;
    const emojis = guild.emojis.cache.map(e => e.toString()).join(' '); // Sunucudaki emojileri al ve birleştir
    const owner = await guild.fetchOwner(); // Sunucu sahibini al

    // Emojiler çok uzun olabilir, sınırlandır
    const emojiDisplay = emojis.length > 1024 ? `${emojis.slice(0, 1014)}...` : emojis || 'Sunucuda emoji bulunmuyor.';

    // Embed oluştur
    const embed = new MessageEmbed()
      .setTitle(`${guild.name} Sunucusu Hakkında`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .setColor('BLUE')
      .addFields(
        { name: '👑 Sunucu Sahibi', value: `<@${owner.id}>`, inline: true },
        { name: '📅 Oluşturulma Tarihi', value: createdAt, inline: true },
        { name: '👥 Üye Sayısı', value: `Toplam: ${totalMembers}\nKullanıcılar: ${userCount}\nBotlar: ${botCount}`, inline: false },
        { name: '💬 Kanal Sayısı', value: `Metin: ${textChannels}\nSesli: ${voiceChannels}`, inline: true },
        { name: '🎭 Rol Sayısı', value: `${roleCount}`, inline: true },
        { name: '🙂 Emojiler', value: emojiDisplay, inline: false }
      )
      .setFooter('Sunucu bilgileri başarıyla gösterildi.');

    // Embed gönder
    message.channel.send({ embeds: [embed] });
  },
};