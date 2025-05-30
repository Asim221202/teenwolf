const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "nisa",
  description: "Sunucunun en seksisini gösterir.",
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#ffffff') // Pembe renk
      .setTitle('💖 Sunucunun En Seksisi 💖')
      .setDescription('Sunucunun en seksisi: **fassy**')
      .setFooter({ text: 'fassy, güzelliğiyle herkesi büyüleyen kişi.' })
      .setTimestamp()
      .setImage('https://i.imgur.com/nKehe38.gif'); // Fotoğrafı ekledim

    return message.channel.send({ embeds: [embed] });
  }
};