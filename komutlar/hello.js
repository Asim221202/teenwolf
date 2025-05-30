const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Botla selamlaşın!'),

    async execute(interaction) {
        await interaction.reply(`Merhaba, ${interaction.user.username}!`);
    },
};