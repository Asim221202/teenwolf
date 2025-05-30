const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "kadir",  // Komut ismi
  description: "",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#ffffff') // Koyu kırmızı renk
      .setTitle('                 ＺＥＵＳ')  // Başlık
      .setDescription('𝐖𝐡𝐞𝐧 𝐘𝐨𝐮’𝐫𝐞 𝐓𝐡𝐞 𝐕𝐢𝐥𝐥𝐚𝐢𝐧 𝐈𝐧 𝐒𝐨𝐦𝐞𝐨𝐧𝐞 𝐄𝐥𝐬𝐞’𝐬 𝐒𝐭𝐨𝐫𝐲,𝐎𝐰𝐧 𝐈𝐭.')  // Açıklama
      .setFooter('truerippaah', musicIcons.zeuscross)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://i.imgur.com/qqvbNBw.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};