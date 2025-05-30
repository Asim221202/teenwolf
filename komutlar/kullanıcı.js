const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kullanıcı',
  description: 'Kullanıcı bilgilerini gösterir.',
  async execute(message) {
   if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply("Bu komutu kullanmak için yeterli yetkiniz yok.");
    } 
    const roleID = '1327716388726640660'; // Kontrol edilecek rolün ID'si
    const member = message.mentions.members.first() || message.member; // Etiketlenen veya mesaj gönderen kullanıcı
    const user = member.user;

    // DM durumunu kontrol et
    let dmStatus = 'Kapalı ❌';
    try {
      await user.createDM();
      dmStatus = 'Açık ✅';
    } catch {
      dmStatus = 'Kapalı ❌';
    }

    // Rol kontrolü
    const isRegistered = member.roles.cache.has(roleID) ? 'Sunucuya Kayıtlı ✅' : 'Kayıtsız ❌';

    // Embed oluştur
    const embed = new MessageEmbed()
      .setColor('#00FF00') // Yeşil renk
      .setTitle('Kullanıcı Bilgileri!')
      .setThumbnail(user.displayAvatarURL({ dynamic: true })) // Kullanıcının profil fotoğrafı
      .setDescription('༒──────────────༒\n\n' +
        `**Kullanıcı Adı:** ${user.username}\n\n` +
        '༒──────────────༒\n\n' +
        `**Kullanıcı Etiketi:** #${user.discriminator}\n\n` +
        '༒──────────────༒\n\n' +
        `**Kullanıcı ID:** ${user.id}\n\n` +
        '༒──────────────༒\n\n' +
        `**Hesap Oluşturma Tarihi:** ${user.createdAt.toDateString()}\n\n` +
        '༒──────────────༒\n\n' +
        `**DM Durumu:** ${dmStatus}\n\n` +
        '༒──────────────༒\n\n' +
        `**Bot Mu:** ${user.bot ? 'Evet 🤖' : 'Hayır ❌'}\n\n` +
        '༒──────────────༒\n\n' +
        `**Sunucuya Kayıt Durumu:** ${isRegistered}\n\n` +
        '༒──────────────༒')
      .setFooter({
        text: `${user.username} tarafından kullanıldı.`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    // Embed gönder
    message.channel.send({ embeds: [embed] });
  },
};