const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Bir kullanıcının bilgilerini gösterir.')
        .addUserOption(option =>
            option
                .setName('kullanıcı')
                .setDescription('Bilgilerini görmek istediğiniz kullanıcı.')
                .setRequired(false) // Opsiyonel yapıyoruz
        ),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('kullanıcı') || interaction.user; // Kullanıcı seçilmezse komutu kullanan
        const member = await interaction.guild.members.fetch(targetUser.id);

        const embed = new EmbedBuilder()
            .setTitle(`${targetUser.username} Hakkında Bilgi`)
            .setColor('#7289DA')
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Kullanıcı Adı', value: targetUser.tag, inline: true },
                { name: 'Kullanıcı ID', value: targetUser.id, inline: true },
                { name: 'Sunucuya Katılma Tarihi', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                { name: 'Hesap Oluşturulma Tarihi', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`, inline: false },
            )
            .setFooter({ text: `Bilgileri isteyen: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};