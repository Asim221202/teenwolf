const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'butonrol',
    description: 'Birden fazla rol seçeneği sunar ve kullanıcıların bu rolleri alıp çıkarmasına olanak verir.',
    async execute(message, args) {
        // Rolleri ve butonları belirleyelim
        const roles = [
            { name: 'Gay', id: '1327978681066323989' },
            { name: 'Lezbiyen', id: '1327978735374438520' },
            { name: 'Heteroseksüel', id: '1327979172823302276' },
        ];

        // Butonlar oluşturuluyor
        const row = new MessageActionRow();
        roles.forEach(role => {
            row.addComponents(
                new MessageButton()
                    .setCustomId(`toggleRole_${role.id}`)
                    .setLabel(role.name)
                    .setStyle('PRIMARY')
            );
        });

        // Embed mesajı oluşturuyoruz
        const embed = new MessageEmbed()
            .setColor('#3498db') // Embed rengi
            .setTitle('Rol Seçme')
            .setDescription('Aşağıdaki butonlara tıklayarak bir rol alabilir veya çıkarabilirsiniz. Her buton bir rolü temsil eder.')
            .addField('Not:', 'Her rolün üzerine tıklayarak rolü alabilir ya da geri alabilirsiniz.')
            .setTimestamp()
            .setFooter('Rol Sistemi', message.guild.iconURL());

        // Kullanıcıya mesaj gönderme
        await message.channel.send({
            embeds: [embed],
            components: [row],
        });
    },
};