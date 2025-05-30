const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiktokembed')
        .setDescription('Bir TikTok linkini gelişmiş embed ile gönderir.')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('TikTok video linki')
                .setRequired(true)),
    async execute(interaction) {
        const tiktokLink = interaction.options.getString('link');
        let fxTikTokLink = tiktokLink;

        if (tiktokLink.includes('https://www.tiktok.com')) {
            fxTikTokLink = tiktokLink.replace('https://www.tiktok.com', 'https://tfxktok.com');
        } else if (tiktokLink.includes('https://tiktok.com')) {
            fxTikTokLink = tiktokLink.replace('https://tiktok.com', 'https://tfxktok.com');
        } else if (tiktokLink.includes('https://vt.tiktok.com')) {
            fxTikTokLink = tiktokLink.replace('https://vt.tiktok.com', 'https://tfxktok.com');
        }

        await interaction.reply({ content: fxTikTokLink });
    },
};
