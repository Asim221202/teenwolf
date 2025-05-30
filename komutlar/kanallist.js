const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'kanallist',
    description: 'data/kanalid.json dosyasındaki kanalları listele.',
    async execute(message) {
        // JSON dosyasını oku
        const allowedChannelsData = JSON.parse(fs.readFileSync('data/kanalid.json', 'utf8'));

        // allowedChannels listesini al
        let allowedChannels = allowedChannelsData.allowedChannels;

        // Eğer allowedChannels boşsa, bir mesaj gönder
        if (!allowedChannels || allowedChannels.length === 0) {
            return message.reply('Kanallar bulunamadı.');
        }

        // Kanalları 25'li gruplara ayır
        let chunks = [];
        while (allowedChannels.length) {
            chunks.push(allowedChannels.splice(0, 25)); // Her seferinde 25 seçenek al
        }

        // Embed oluştur
        const embed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Kanalları Listele')
            .setDescription('İşte data/kanalid.json dosyasındaki kanallar:');

        // İlk sayfa için kanalları listele
        let currentPage = 0;
        embed.setDescription(formatPage(chunks[currentPage], currentPage + 1, chunks.length, message));

        // Sayfa seçim menüsünü oluştur
        const selectMenu = new MessageSelectMenu()
            .setCustomId('kanal_select')
            .setPlaceholder('Sayfa Seçin...')
            .addOptions(
                chunks.map((_, index) => ({
                    label: `Sayfa ${index + 1}`,
                    value: `${index + 1}`,
                    description: `Sayfa ${index + 1} (${(index * 25) + 1}-${Math.min((index + 1) * 25, allowedChannels.length)})`,
                }))
            );

        const row = new MessageActionRow().addComponents(selectMenu);

        // Başlangıçta sayfa 1'i göster
        const msg = await message.reply({
            content: 'Kanallar listeleniyor:',
            embeds: [embed],
            components: [row],
        });

        // Menüden sayfa seçilince çalışacak event
        const filter = interaction => interaction.customId === 'kanal_select' && interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            const selectedPage = parseInt(interaction.values[0], 10) - 1; // Sayfa numarasını al
            currentPage = selectedPage;

            // Embed'i güncelle
            embed.setDescription(formatPage(chunks[currentPage], currentPage + 1, chunks.length, message));
            await interaction.update({ embeds: [embed] });
        });

        collector.on('end', async () => {
            // Collector sona erdiğinde menüyü kaldır
            await msg.edit({ components: [] });
        });
    },
};

// Sayfa içeriğini formatlayan fonksiyon
// Sayfa içeriğini formatlayan fonksiyon
function formatPage(chunks, currentPage, totalPages, message) {
    const channelsList = chunks.map(channelId => {
        const channel = message.guild.channels.cache.get(channelId);
        // Kanal etiketini (#kanaladı) oluştur
        const channelMention = channel ? `<#${channel.id}>` : 'Unknown Channel';
        return channelMention;
    }).join('\n');

    return `Sayfa ${currentPage} / ${totalPages}\n\n${channelsList}`;
}