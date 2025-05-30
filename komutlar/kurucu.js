const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "kurucu",  // Komut ismi
  description: "Kurucuları gösterir.",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#8B0000') // Koyu kırmızı renk
      .setTitle('**The Other Side discordun sefiridir.**')  // Başlık
      .setDescription('')  // Açıklama
      .setFooter('Biat edin lan', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://s4.ezgif.com/tmp/ezgif-4f22f46e006b1.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};