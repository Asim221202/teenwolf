const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js');
module.exports = {
  name: 'yusuf',
  description: 'Sunucu kaşarını gösterir.',
  execute: async (message) => {
    // Embed oluştur
    const embed = new MessageEmbed()
      .setColor('RED') // Renk seçimi
      .setTitle('Sunucu Kaşarımız') // Başlık
      .setDescription('*The Myth, The Legend, The Baddest Bitch Of All*') // Açıklama
      .setImage('https://i.imgur.com/Tr5g9tC.gif') // Görsel
      .setFooter('Bunu herkes biliyor zaten', musicIcons.heartIcon); // Alt yazı

    // Embed gönder
    message.channel.send({ embeds: [embed] });
  },
};