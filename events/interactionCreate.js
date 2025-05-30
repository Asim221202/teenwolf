  const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        // Slash komutları için
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(`Komut çalıştırılırken hata oluştu: ${error.message}`);
                await interaction.reply({ content: "Bir hata oluştu!", ephemeral: true });
            }
        }

        // Buton etkileşimleri için
        if (interaction.isButton()) {
            const { customId, user, guild } = interaction;

            // 📌 Mağaza butonları
            if (customId.startsWith("shop_")) {
                const category = customId.replace("shop_", ""); // Kategori ismini al
                const categories = {
                    "Araçlar": [
                        "Düşük Seviye Araçlar - 20000$",
                        "Orta Seviye Araçlar - 30000$",
                        "Motorlar - 18000$",
                        "Yüksek Seviye Araçlar - 45000$"
                    ],
                    "Evler": [
                        "Müstakil Ev - 10000$",
                        "Dublex Ev - 20000$",
                        "Orman Evi - 30000$",
                        "Dağ Evi - 40000$",
                        "Villa - 100000$",
                        "Malikane - 200000$"
                    ],
                    "Teçhizat": [
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

                if (!categories[category]) {
                    return interaction.reply({ content: "Bu kategori bulunamadı!", ephemeral: true });
                }

                const products = categories[category].map(product => `• ${product}`).join("\n");

                const embed = new MessageEmbed()
                    .setTitle(`📂 ${category} Kategorisi`)
                    .setDescription(products || "Bu kategoride ürün bulunmuyor.")
                    .setColor("GREEN");

                await interaction.update({ embeds: [embed] });
            }
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return; // Eğer butona basılmamışsa, işlem yapma.

    // Butonun customId'sini kontrol et
    if (interaction.customId === 'katıl_button') {
      const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'katılımcı'); // Katılımcı rolü
      if (!role) {
        return interaction.reply({ content: 'Katılımcı rolü bulunamadı!', ephemeral: true });
      }

      // Kullanıcıya rol ver
      try {
        await interaction.member.roles.add(role);
        return interaction.reply({ content: 'Çekilişe katıldınız!', ephemeral: true });
      } catch (error) {
        console.error(error);
        return interaction.reply({ content: 'Rol verilirken bir hata oluştu.', ephemeral: true });
      }
    }
  }
};
            // 📌 Rol butonları (örnek)
            const [action, roleId] = customId.split("_");
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(roleId);

            if (!role) {
                return interaction.reply({ content: "Bu rol bulunamadı.", ephemeral: true });
            }

            if (member.roles.cache.has(role.id)) {
                // Rolü çıkar
                await member.roles.remove(role);
                const embed = new MessageEmbed()
                    .setColor("#e74c3c") // Kırmızı renk, rol alındı
                    .setTitle("Rol Alındı")
                    .setDescription(`${role.name} rolü alındı.`)
                    .setTimestamp()
                    .setFooter("The Other Side", interaction.guild.iconURL());

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                // Rolü ekle
                await member.roles.add(role);
                const embed = new MessageEmbed()
                    .setColor("#2ecc71") // Yeşil renk, rol verildi
                    .setTitle("Rol Verildi")
                    .setDescription(`${role.name} rolü eklendi.`)
                    .setTimestamp()
                    .setFooter("The Other Side", interaction.guild.iconURL());

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
};          