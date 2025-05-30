module.exports = {
  name: 'dm-uyar',
  description: 'Etiketlenen kullanıcıya DM’den roleplay uyarısı gönderir.',
  execute(message, args) {
    // Yetki kontrolü
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.reply('Bu komutu kullanmak için yetkin yok.');
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply('Lütfen uyarılacak kişiyi etiketle.');
    }

    if (member.user.bot) {
      return message.reply('Botlara mesaj gönderemem.');
    }

    const dmMessage = `**Merhaba! Seni yakın zamanlarda roleplay yaparken göremedik. Lütfen en kısa sürede roleplay'e katılım sağlamanı rica ediyoruz. Aksi takdirde karakterin alınacaktır!**    https://discord.gg/theotherside`;

    member.send(dmMessage)
      .then(() => {
        message.reply(`${member.user.tag} kişisine uyarı mesajı gönderildi.`);
      })
      .catch(() => {
        message.reply('Bu kişiye DM gönderilemedi (DM’leri kapalı olabilir).');
      });
  }
};