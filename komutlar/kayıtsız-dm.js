const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'kayıtsız-dm',
    description: 'Belirli bir role sahip kullanıcılara DM gönderir (isteğe bağlı ek ile birlikte).',
    usage: '.kayıtsız-dm <rol adı veya @&rol_id> <mesaj> (isteğe bağlı fotoğraf)',
    guildOnly: true,
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const roleIdentifier = args.shift();
        const dmMessage = args.join(' ');
        let role;
        const attachment = message.attachments.first();

        if (!roleIdentifier) {
            return message.reply('Lütfen göndermek istediğiniz rolün adını veya etiketini (@&rol_id) belirtin.');
        }

        if (!dmMessage && !attachment) {
            return message.reply('Lütfen DM olarak göndermek istediğiniz bir mesaj veya bir fotoğraf belirtin.');
        }

        if (roleIdentifier.startsWith('<@&') && roleIdentifier.endsWith('>')) {
            const roleId = roleIdentifier.slice(3, -1);
            role = await message.guild.roles.fetch(roleId).catch(() => null);
        } else {
            role = message.guild.roles.cache.find(r => r.name === roleIdentifier);
        }

        if (!role) {
            return message.reply(`"${roleIdentifier}" adında bir rol bulunamadı.`);
        }

        const membersWithRole = message.guild.members.cache.filter(member => member.roles.cache.has(role.id) && !member.user.bot);
        let sentCount = 0;
        const errorUsers = [];

        // Daha doğru sayım için döngü içinde Promise.resolve() kullanın
        for (const member of membersWithRole.values()) {
            try {
                const sendPayload = { content: dmMessage };
                if (attachment) {
                    sendPayload.files = [attachment.url];
                }
                await member.send(sendPayload);
                sentCount++;
                console.log(`${member.user.tag} adlı kullanıcıya DM gönderildi (ek ile: ${!!attachment}).`);
            } catch (error) {
                console.error(`${member.user.tag} adlı kullanıcıya DM gönderilirken bir hata oluştu:`, error);
                errorUsers.push(member.user.tag);
            }
        }

        const embed = new MessageEmbed()
            
            .setTitle('DM Gönderimi Tamamlandı')
            .setDescription(`${role.name} rolüne sahip ${sentCount} kullanıcıya DM gönderildi.`)
            .setTimestamp();

        if (errorUsers.length > 0) {
            embed.addField('Hata Alan Kullanıcılar', errorUsers.join('\n'));
        }

        message.reply({ embeds: [embed] });
    },
};
