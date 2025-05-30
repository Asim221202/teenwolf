const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "asım",  // Komut ismi
  description: "",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#8B0000') // Koyu kırmızı renk
      .setTitle('LİTTLE PİG LİTTLE PİG')  // Başlık
      .setDescription('LET ME IN!🔪')  // Açıklama
      .setFooter('stefanrickgrimesjoldbergbabapro', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://i.imgur.com/Qn6xFwY.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};