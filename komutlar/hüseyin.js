const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "huso",  // Komut ismi
  description: "New Orleans'in kralını gösterir.",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#8B0000') // Koyu kırmızı renk
      .setTitle('The Ruthless Psychopath')  // Başlık
      .setDescription('')  // Açıklama
      .setFooter('', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://i.imgur.com/lBgMtwi.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};