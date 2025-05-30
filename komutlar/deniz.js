const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "deniz",  // Komut ismi
  description: "",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#ffffff') // Koyu kırmızı renk
      .setTitle('Kurtların Kraliçesi ')  // Başlık
      .setDescription('O zaman yerine otur, sesini kes ve dinlemeye başla...')  // Açıklama
      .setFooter('Deniz, dedikodu makinesi', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://cdn.discordapp.com/attachments/1288593663802343434/1375838660691234849/078c27fdbed048fdae9cf1688ce3ae82.gif')
    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};