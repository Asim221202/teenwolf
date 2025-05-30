const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'seviyesıralama',
    description: 'Kullanıcıların seviyelerine göre sıralama gösterir.',
    async execute(message) {
        try {
            // Seviye verisi dosyasını oku
            const wordDataPath = './data/kelimeVerisi.json';
            let wordData = {};

            // Veriyi dosyadan çekme
            try {
                if (fs.existsSync(wordDataPath)) {
                    wordData = JSON.parse(fs.readFileSync(wordDataPath, 'utf8'));
                } else {
                    message.reply('Seviye verisi bulunamadı!');
                    return;
                }
            } catch (error) {
                console.error('Seviye verisi okuma hatası:', error);
                message.reply('Seviye verisi okuma hatası oluştu.');
                return;
            }

            // Verileri seviyelerine göre sıralama
            const sortedUsers = Object.keys(wordData)
                .map(userId => ({
                    userId,
                    level: wordData[userId].level || 0, // Eğer level eksikse 0 kabul et
                }))
                .sort((a, b) => b.level - a.level);

            // Kullanıcı etiketlerini almak için fetch işlemi
            const rankDescription = await Promise.all(
                sortedUsers.map(async (user, index) => {
                    try {
                        const fetchedUser = await message.client.users.fetch(user.userId);
                        const username = fetchedUser.username; // Sadece kullanıcı adı
                        return `${index + 1}. ${username} - ${user.level}`;
                    } catch {
                        return `${index + 1}. Bilinmiyor - ${user.level}`;
                    }
                })
            );

            // Embed mesajı oluşturma
            const rankEmbed = new MessageEmbed()
                .setTitle('Seviye Sıralaması')
                .setColor('BLUE')
                .setDescription(rankDescription.join('\n') || 'Henüz hiçbir kullanıcı sıralamaya katılmamış.')
                .setFooter('Seviye Sistemi')
                .setTimestamp();

            // Embed mesajını gönder
            message.reply({ embeds: [rankEmbed] });

        } catch (error) {
            console.error('Seviye sıralama komutunda bir hata oluştu:', error);
            message.reply('Seviye sıralama komutunu işlerken bir hata oluştu!');
        }
    },
};