const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "ali",  // Komut ismi
  description: "",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#ffffff') // Koyu kırmızı renk
      .setTitle('Sunucunun ennn kibarı')  // Başlık
      .setDescription('I am vengeance. I am the night. I am Batman!')  // Açıklama
      .setFooter('Kibar Ali', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://cdn.discordapp.com/attachments/1328325085764784190/1376570552214360094/IMG_5035.gif');  // Büyük fotoğraf

    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};