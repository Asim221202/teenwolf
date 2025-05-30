const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'butonrol2',
    description: 'Başka bir rol seti sunar ve kullanıcıların bu rolleri alıp çıkarmasına olanak verir.',
    async execute(message, args) {
        // Yeni rol seti
        const roles = [
            { name: 'Partner Ping', id: '1330264276447006822' },
        ];

        // Yeni buton seti oluştur
        const row = new MessageActionRow();
        roles.forEach(role => {
            row.addComponents(
                new MessageButton()
                    .setCustomId(`toggleExtraRole_${role.id}`)
                    .setLabel(role.name)
                    .setStyle('SUCCESS') // Farklı bir stil kullan
            );
        });

        // Yeni embed mesajı
        const embed = new MessageEmbed()
            .setColor('#9b59b6') // Mor renk
            .setTitle('Partner kanallarını görmek için butona dokunun.')
            .setDescription('')
            .setTimestamp()
            .setFooter('Buton Rol Sistemi', message.guild.iconURL());

        // Mesaj gönder
        await message.channel.send({
            embeds: [embed],
            components: [row],
        });
    },
};