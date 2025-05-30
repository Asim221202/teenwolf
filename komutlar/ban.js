const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Belirtilen kullanıcıyı sunucudan banlar ve ban detaylarını belirli bir kanala gönderir.',
    usage: '<@kullanıcı> [sebep]',
    permissions: ['BAN_MEMBERS'],
    execute: async (message, args) => {
        const logChannelID = '1331625066642931722'; // Ban loglarının gönderileceği kanalın ID'si

        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('Bu komutu kullanmak için götünüz yok!');
        }

        const user = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi.';

        if (!user) {
            return message.reply("Sikilecek kullanıcıyı belirtin!");
        }

        if (!user.bannable) {
            return message.reply('Bu kullanıcıyı banlamaya götüm yetmedi.');
        }

        try {
            await user.ban({ reason });

            // Embed mesajı oluşturma
            const banEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('🚨 Kullanıcı Banlandı!')
                .setDescription(`**${user.user.tag}** sunucudan banlandı.`)
                .addField('Sebep', reason, true)
                .addField('Banlayan Yetkili', message.author.tag, true)
                .setImage('https://media1.tenor.com/m/GSQOz7EVbYMAAAAd/ban.gif')
                .setTimestamp();

            // Ban mesajını komutun kullanıldığı kanala gönder
            await message.channel.send({ embeds: [banEmbed] });

            // Log kanalını bulma
            const logChannel = message.guild.channels.cache.get(logChannelID);
            if (logChannel) {
                const logEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle('⚠ Kullanıcı Banlandı')
                    .addField('Kullanıcı', `${user.user.tag} (${user.id})`, true)
                    .addField('Sebep', reason, true)
                    .addField('Banlayan Yetkili', message.author.tag, true)
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                message.channel.send('⚠ Belirtilen log kanalı bulunamadı. Lütfen kanal ID\'sini kontrol edin.');
            }

        } catch (error) {
            console.error(error);
            message.reply('Bir hata oluştu ve kullanıcı banlanamadı.');
        }
    },
};