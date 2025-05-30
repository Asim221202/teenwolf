const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'mağaza',
    description: 'Mağaza kategorilerini gösterir.',
    execute(message) {
        // Kategoriler ve ürünler
        const categories = {
            "Araçlar": [
                "Eski Model Araba - 20000$",
                "Standart Araba - 30000$",
                "Motosiklet - 18000$",
                "Spor Araba - 45000$"
            ],
            "Evler": [
                "Müstakil Ev - 20000$",
                "Dublex Ev - 30000$",
                "Orman Evi - 40000$",
                "Dağ Evi - 50000$",
                "Villa - 100000$",
                "Malikane - 500000$"
            ],
            "Teçhizatlar": [
                "Tabanca - 6000$",
                "Sonsuz Tahta Mermi - 3000$",
                "Arbalet - 3500$",
                "Mine Çiçeği - 500$",
                "Mine Bombası - 1500$",
                "Mine Şırıngası - 1000$", 
                "Kurtboğan - 500$",
                "Kurtboğan Bombası - 1500$",
                "Kurtboğan Şırıngası - 1000$"
            ],
            "Takılar": [
                "Gün Işığı Takıları - 1000$",
                "Ay Işığı Takıları - 2000$",
                "Gilbert Yüzüğü - 2500$"
            ]
        };

        // Kategori başına görsel URL'leri
        const categoryImages = {
            "Araçlar": "https://i.imgur.com/5NjHuR0.gif",
            "Evler": "https://link-to-your-image.com/evler.jpg",
            "Teçhizat": "https://link-to-your-image.com/techizat.jpg",
            "Takılar": "https://link-to-your-image.com/takilar.jpg"
        };

        // Menü seçenekleri
        const options = Object.keys(categories).map(category => ({
            label: category,
            description: `${category} ürünlerini görüntüle.`,
            value: category
        }));

        // Başlangıç embed
        const embed = new MessageEmbed()
            .setTitle("Mağaza Menüsü")
            .setDescription("Bir kategori seçerek o kategoriye ait ürünleri görebilirsiniz.")
            .setColor("BLUE")
            .setFooter("Mağaza | Seçim yapmak için menüyü kullanın.");

        // Select menu
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('mağaza_menu')
                .setPlaceholder('Kategori seçin...')
                .addOptions(options)
        );

        // Mesaj gönderme
        message.channel.send({ embeds: [embed], components: [row] });

        // Menü etkileşim filtresi
        const filter = interaction => interaction.customId === 'mağaza_menu' && interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', interaction => {
            const category = interaction.values[0];
            const products = categories[category].map(product => `• ${product}`).join('\n'); // Ürünleri alt alta yazdırmak için

            // Kategoriye ait görsel
            const categoryEmbed = new MessageEmbed()
                .setTitle(`${category}`)
                .setDescription(products || "Bu kategoride ürün bulunmuyor.")
                .setColor("GREEN")
                .setImage(categoryImages[category]); // Kategoriye özel görsel

            interaction.update({ embeds: [categoryEmbed] });
        });

        collector.on('end', () => {
            message.channel.send("Mağaza menüsü süresi doldu. Tekrardan kullanmak için `.mağaza` yazın.");
        });
    }
};