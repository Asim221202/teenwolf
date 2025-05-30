const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "yaren",  // Komut ismi
  description: "",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#ffffff') // Koyu kırmızı renk
      .setTitle('YARR(AK)EN')  // Başlık
      .setDescription('KEESSS LANN ÇENENİİ')  // Açıklama
      .setFooter('tutku utku', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://i.imgur.com/eP5w8Zn.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};