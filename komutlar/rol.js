const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rol',
    description: 'Belirtilen rolde olan üyeleri listeler.',
    async execute(message, args) {
        // Eğer komut yanlış kullanıldıysa uyarı ver
        if (!args.length) {
            return message.reply('Lütfen bir rol belirtin. Örnek: `.rol @role`');
        }

        // Rol etiketini al (örneğin "@role")
        const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name === args.join(' '));

        // Eğer rol bulunamazsa uyarı ver
        if (!role) {
            return message.reply('Bu isimde bir rol bulunamadı.');
        }

        try {
            // Tüm üyeleri fetch et
            const membersWithRole = await message.guild.members.fetch();

            // Rolü taşıyan üyeleri filtrele
            const membersWithRoleList = membersWithRole.filter(member => member.roles.cache.has(role.id));

            // Eğer rolde üye yoksa uyarı ver
            if (membersWithRoleList.size === 0) {
                return message.reply(`Bu rolde herhangi bir üye bulunmamaktadır.`);
            }

            const memberList = membersWithRoleList.map(member => `<@${member.user.id}>`).join('\n'); // Üyelerin etiketlerini birleştir

            // Embed mesajını oluştur
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${role.name} Rolündeki Üyeler`)
                .setDescription(memberList || 'Üye bulunamadı.')
                .setFooter(`Toplam Üye: ${membersWithRoleList.size}`);

            // Embed mesajını gönder
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('Bir hata oluştu.');
        }
    }
};