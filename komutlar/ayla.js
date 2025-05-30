const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "ayla",  // Komut ismi
  description: "",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#ffffff') // Koyu kırmızı renk
      .setTitle('Scorpio Woman')  // Başlık
      .setDescription('Feeling the passion hidden behind her mysterious gaze is like getting lost in the touch of a Scorpio woman. ♏︎')  // Açıklama
      .setFooter('Lilith', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://i.imgur.com/WXoEN9y.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};