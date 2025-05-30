const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js'); // Iconları içe aktar

module.exports = {
  name: "ping",
  description: "Check the bot latency",
  execute(message) {
    const start = Date.now();
    message.channel.send("Pinging...").then(async (sent) => {
      const end = Date.now();
      const latency = end - start;
      const apiLatency = message.client.ws.ping;

      const embed = new MessageEmbed()
        .setColor('WHITE')
        .setAuthor('Ping Information', musicIcons.pingIcon, 'https://discord.gg/xQF9f9yUEM')
        .setDescription(`
          **Latency**: ${latency}ms 
**API Latency**: ${apiLatency}ms
        `)
        .setTimestamp()
        .setFooter('Bot Ping', musicIcons.heartIcon);

      sent.edit({ content: null, embeds: [embed] });
    });
  },
};