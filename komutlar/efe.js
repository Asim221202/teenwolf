const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "assaaaasaaasasasasasasasaaasssssaaaaassssü",  // Komut ismi
  description: "New Orleans'in kralını gösterir.",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#8B0000') // Koyu kırmızı renk
      .setTitle('karpuz efe')  // Başlık
      .setDescription('karpuz')  // Açıklama
      .setFooter('sulu', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://s6.ezgif.com/tmp/ezgif-6be9799681e456.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};