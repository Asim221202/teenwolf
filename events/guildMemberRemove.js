const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'guildMemberRemove',
    execute(member) {
        // Ayrılma mesajı kanalı
        const farewellChannel = member.guild.channels.cache.get('1327543010065645582'); // Ayrılma kanalı ID'sini buraya girin
        if (!farewellChannel) return console.error('Ayrılma kanalı bulunamadı!');

        // Hoşçakal Embed
        const farewellEmbed = new MessageEmbed()
            .setColor('#FFFFFF') // Renk
            .setAuthor({
                name: member.user.username, // Kullanıcının adı
                iconURL: member.user.displayAvatarURL({ dynamic: true }),
            })
            .setTitle(`𝐓𝐡𝐞 𝐎𝐭𝐡𝐞𝐫 𝐒𝐢𝐝𝐞 𝐒𝐮𝐧𝐮𝐜𝐮𝐬𝐮𝐧𝐚 𝐕𝐞𝐝𝐚 𝐄𝐭𝐭𝐢.`) // Kullanıcının tag'i
            .setDescription(
                `𝑇𝑒𝑘𝑟𝑎𝑟 𝐺𝑜̈𝑟𝑢̈𝑠̧𝑚𝑒𝑘 𝑈̈𝑧𝑒𝑟𝑒, **${member.user.username}**!`
            )
            .addField('Kullanıcı:', member.user.username, true) // Kullanıcı adı
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 })) // Sağ üst köşede kullanıcı avatarı
            .setImage('https://i.imgur.com/gnJG7lk.gif') // Ayrılma GIF'i
            .setFooter({
                text: `Hoşçakal, ${member.user.username}!`,
                iconURL: member.guild.iconURL({ dynamic: true }),
            });

        // Ayrılma mesajını gönder
        farewellChannel.send({ content: `> ${member}, **Sunucudan Ayrıldı!**`, embeds: [farewellEmbed] });

        // Kullanıcının verilerini silme
        const userId = member.id;

        // Veriler silinecek dosyaların yolları
        const dataFiles = [
            path.join(__dirname, 'data', 'kelimeVerisi.json'),
            path.join(__dirname, 'data', 'balances.json'),
            path.join(__dirname, 'data', 'envanter.json')
        ];

        // Her dosyada kullanıcı verilerini sil
        dataFiles.forEach((filePath) => {
            try {
                if (fs.existsSync(filePath)) {
                    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                    // Kullanıcı verisini kontrol et ve sil
                    if (data[userId]) {
                        delete data[userId];
                        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                        console.log(`Kullanıcı verisi silindi: ${filePath} -> ${userId}`);
                    }
                }
            } catch (error) {
                console.error(`${filePath} dosyasından veri silinirken bir hata oluştu:`, error);
            }
        });
    },
};