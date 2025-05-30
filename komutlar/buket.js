const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "bahahaajaaanababahabababat",  // Komut ismi
  description: "Lori Grimes gösterir.",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#FFC0CB') // Koyu kırmızı renk
      .setTitle('aneyaseyo')  // Başlık
      .setDescription('꽃다발 상품 로리 그라임스')  // Açıklama
      .setFooter('Lori Grimes', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://i.imgur.com/QSRtFDs.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};