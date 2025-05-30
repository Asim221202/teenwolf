const { MessageEmbed } = require('discord.js');

// Eski whitelist kullanıcıları (JSON'dan veya başka bir kaynaktan alınabilir)
let whitelistedUsers = ['user_id_1', 'user_id_2'];  // Eski whitelist kullanıcıları

// Kullanıcı veritabanı (burada yerel olarak tanımladık, ama dışarıdan alınabilir)
function isWhitelisted(userId) {
    return whitelistedUsers.includes(userId);
}

// Yetkililerin komutu kullanabilmesi için kontrol
function isAuthorized(member) {
    // Yetkili kullanıcılar burada belirleniyor (örneğin admin, mod)
    return member.permissions.has('ADMINISTRATOR') || member.permissions.has('MANAGE_ROLES');
}

module.exports = {
    name: 'rolver',
    description: 'Kullanıcıya belirtilen rolü verir.',
    async execute(message, args) {
        const member = message.mentions.members.first(); // Rol verilecek kullanıcı
        const roleName = args.slice(1).join(' '); // Rol adı

        // Eğer kullanıcı bir yetkili değilse ve whitelist'te değilse komut çalışmasın
        if (!isAuthorized(message.member) && !isWhitelisted(message.author.id)) {
            return message.reply("Bu komutu kullanabilmek için whitelist'te olmalısınız veya yeterli yetkiniz olmalı.");
        }

        if (!member) {
            return message.reply("Rol verilecek kullanıcıyı belirtmelisiniz.");
        }

        if (!roleName) {
            return message.reply("Vermek istediğiniz rolün adını yazmalısınız.");
        }

        const role = message.guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
            return message.reply("Bu isimde bir rol bulunamadı.");
        }

        // Rol hiyerarşisi kontrolü
        if (message.member.roles.highest.comparePositionTo(role) <= 0) {
            return message.reply("Bu rolü vermek için yeterli yetkiye sahip değilsiniz. Sadece bu rolden üstün yetkiye sahip kullanıcılar bu rolü verebilir.");
        }

        try {
            // Kullanıcıya rol ver
            await member.roles.add(role);

            // Embedli yanıt mesajı
            const embed = new MessageEmbed()
                .setColor('#00FF00')
                .setTitle('Rol Verme İşlemi Başarılı')
                .setDescription(`${member.user.username} kullanıcısına başarıyla **${roleName}** rolü verildi.`)
                .addField('Kullanıcı:', member.user.username, true)
                .addField('Rol:', roleName, true)
                .setFooter('Rol verme işlemi başarıyla tamamlandı.')
                .setTimestamp();

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error("Rol verirken hata oluştu:", error);

            // Hata mesajı için embed
            const errorEmbed = new MessageEmbed()
                .setColor('#0000FF')
                .setTitle('Rol Verme Hatası')
                .setDescription("Rol verilemedi. Lütfen botun yetkilerini kontrol edin ve tekrar deneyin.")
                .setFooter('Bir hata oluştu.')
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    }
};