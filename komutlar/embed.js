const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'embed',
  description: 'Creates an embed message with user\'s profile picture.',
  execute(message, args) {
    const { guild } = message;
    // args dizisini tek bir string olarak birleştiriyoruz
    const input = args.join(' ');

    // Başlık ve açıklamayı tırnak içinde almak için RegEx kullanıyoruz
    const matches = input.match(/"([^"]+)"\s*"([^"]+)"/);

    if (!matches) {
      return message.reply('Lütfen komutu şu formatta kullanın: `.embed "Başlık" "Açıklama"`');
    }

    const title = matches[1]; // İlk tırnak içindeki değer başlık
    const description = matches[2]; // İkinci tırnak içindeki değer açıklama

    // Kullanıcının profil fotoğrafını al
    const userAvatar = message.author.displayAvatarURL();

    // Embed oluştur
    const embed = new MessageEmbed()
      .setColor('#ffffff')
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 })) // Kullanıcı avatarını embed'e ekle
      .setTimestamp()
      .setFooter('');

    // Embed'i gönder
    message.channel.send({ embeds: [embed] });
  },
};