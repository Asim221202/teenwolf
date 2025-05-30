const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'yardım',
    description: 'Yardım menüsünü gösterir.',
    execute(message) {
        // Kategoriler ve komutlar
        const categories = {
            "Genel": ["ping", "yardım", "yapımcı", "kullanıcı", "sunucu"],
            "Ekonomi": ["bakiye", "paraekle", "parasil", "çek", "yatır", "envanter", "mağaza"],
            "Moderasyon": ["mute","kayıt", "unmute", "rolver"],
            "Eğlence": ["kelime", "yusuf", "ayaz"],
            "Mağaza": ["satınal"]
        };

        // Menü seçenekleri
        const options = Object.keys(categories).map(category => ({
            label: category,
            description: `${category} komutlarını görüntüle.`,
            value: category
        }));

        // Başlangıç embed
        const embed = new MessageEmbed()
            .setTitle("Yardım Menüsü")
            .setDescription("Bir kategori seçerek o kategoriye ait komutları görebilirsin.")
            .setColor("BLUE");

        // Select menu
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('help_menu')
                .setPlaceholder('Kategori seçin...')
                .addOptions(options)
        );

        // Mesaj gönderme
        message.channel.send({ embeds: [embed], components: [row] });

        // Menü etkileşim filtresi
        const filter = interaction => interaction.customId === 'help_menu' && interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', interaction => {
            const category = interaction.values[0];
            const commands = categories[category].map(cmd => `\`${cmd}\``).join(', ');

            const categoryEmbed = new MessageEmbed()
                .setTitle(`${category} Komutları`)
                .setDescription(commands || "Bu kategoride komut bulunmuyor.")
                .setColor("GREEN");

            interaction.update({ embeds: [categoryEmbed] });
        });

        collector.on('end', () => {
            message.channel.send("Yardım menüsü süresi doldu.");
        });
    }
};