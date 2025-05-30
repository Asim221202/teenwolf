const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');  // icons.js dosyasını import ettik

module.exports = {
  name: "ayaz",  // Komut ismi
  description: "New Orleans'in kralını gösterir.",  // Komut açıklaması
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#8B0000') // Koyu kırmızı renk
      .setTitle('"How low can I go? I was once a god. Now I am a prisoner."')  // Başlık
      .setDescription('"Huh. Ugh, I gotta shave this shit."')  // Açıklama
      .setFooter('"What? Was the joke that bad?"', musicIcons.heartIcon)  // Footer metni ve iconu
      .setTimestamp()  // Zaman damgası
      .setImage('https://cdn.discordapp.com/attachments/1328325085764784190/1376574329583702078/IMG_5039.gif')
    return message.channel.send({ embeds: [embed] });  // Embed mesajı gönder
  }
};