const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'tag',
    description: 'Sunucunun tagını gösterir.',
    execute(message, args) {
        // Tag mesajı
        const tag = "༒";

        // Mesajı gönder
        message.channel.send(tag);
    },
};