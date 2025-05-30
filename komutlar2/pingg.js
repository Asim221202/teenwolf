const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('a') // Komut adı
        .setDescription('Komut açıklaması'), // Komut açıklaması
    async execute(interaction) {
        // Komut işlevselliği burada olacak
        await interaction.reply('Komut çalıştı!');
    },
};