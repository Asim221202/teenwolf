const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rolal',
    description: 'Kullanıcıdan belirtilen rolü alır.',
    async execute(message, args) {
      if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.reply("Bu komutu kullanmak için gerekli göte sahip değilsiniz!");
        }
        const member = message.mentions.members.first(); // Rol alınacak kullanıcı
        if (!member) {
            return message.reply("Rol alınacak kullanıcıyı belirtmelisiniz.");
        }

        // Kendi rolünü alma kontrolü: Kendi rolünü almak engellenmemeli
        if (member.id === message.author.id) {
            // Kendi rolünü almak için herhangi bir kısıtlama yok
        }

        // Başka bir kullanıcının rolünü alma izni: Hedef kullanıcının rolü sizden yüksekse, rol alamazsınız
        if (message.member.roles.highest.position <= member.roles.highest.position && member.id !== message.author.id) {
            return message.reply("Bu kullanıcının rolü sizden daha yüksek olduğu için ondan rol alamazsınız.");
        }

        const roleName = args.slice(1).join(' ');
        if (!roleName) {
            return message.reply("Almak istediğiniz rolün adını yazmalısınız.");
        }

        const role = message.guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
            return message.reply("Bu isimde bir rol bulunamadı.");
        }

        try {
            // Kullanıcıdan rol al
            await member.roles.remove(role);

            // Embedli başarı mesajı
            const embed = new MessageEmbed()
                .setColor('#0000FF') // Mavi renk
                .setTitle('Rol Alma İşlemi Başarılı')
                .setDescription(`${member.user.username} kullanıcısından başarıyla **${roleName}** rolü alındı.`)
                .addField('Kullanıcı:', member.user.username, true)
                .addField('Rol:', roleName, true)
                .setFooter('Rol alma işlemi başarıyla tamamlandı.')
                .setTimestamp();

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error("Rol alırken hata oluştu:", error);

            // Hata mesajı için embed
            const errorEmbed = new MessageEmbed()
                .setColor('#FF0000') // Kırmızı renk (hata için)
                .setTitle('Rol Alma Hatası')
                .setDescription("Rol alınamadı. Lütfen botun yetkilerini kontrol edin ve tekrar deneyin.")
                .setFooter('Bir hata oluştu.')
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    }
};