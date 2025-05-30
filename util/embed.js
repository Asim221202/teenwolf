const { MessageEmbed } = require("discord.js");

/**
 * Embed mesaj gönderme fonksiyonu.
 * @param {Object} channel - Mesajın gönderileceği kanal.
 * @param {string} title - Embed başlığı.
 * @param {string} description - Embed açıklaması.
 * @param {string} [color="#0099ff"] - Embed rengi (isteğe bağlı).
 */
function sendEmbed(channel, title, description, color = "#0099ff") {
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp(); // Zaman damgası ekler

    channel.send({ embeds: [embed] });
}

module.exports = { sendEmbed };