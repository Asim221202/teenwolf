const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'butonrol3',
    description: 'Başka bir rol seti sunar ve kullanıcıların bu rolleri alıp çıkarmasına olanak verir.',
    async execute(message, args) {
        // Yeni rol seti
        const roles = [
            { name: 'Partner Ping', id: '1330264276447006822' },
           {name: 'Bot Duyuru Ping', id: '1356981767923433643'}
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
            .setTitle('Rol almak için butona dokunun.')
            .setDescription('')
            .setTimestamp()
            .setFooter('The Other Side', message.guild.iconURL());

        // Mesaj gönder
        await message.channel.send({
            embeds: [embed],
            components: [row],
        });
    },
};