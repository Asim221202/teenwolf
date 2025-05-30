const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'hkelimeekle',
    description: 'Belirtilen kullanıcıya haftalık kelime ekler.',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yetkin yok.');
        }

        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) {
            return message.reply('Lütfen bir kullanıcı etiketleyin.');
        }

        const userId = mentionedUser.id;
        const username = mentionedUser.username;

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Lütfen geçerli bir miktar girin.');
        }

        // Haftalık kelime verisini oku
        let weeklyData;
        try {
            weeklyData = JSON.parse(await fs.promises.readFile('./data/haftalikKelimeVerisi.json', 'utf8'));
        } catch (error) {
            console.error('Haftalık kelime verisi okunamadı:', error);
            return message.reply('Veritabanı okunurken bir hata oluştu.');
        }

        // Kullanıcının kelime verisini güncelle
        if (!weeklyData[userId]) {
            weeklyData[userId] = { words: 0 };
        }
        weeklyData[userId].words += amount;

        // JSON dosyasını güncelle
        try {
            await fs.promises.writeFile('./data/haftalikKelimeVerisi.json', JSON.stringify(weeklyData, null, 2));
        } catch (error) {
            console.error('Haftalık kelime verisi yazılamadı:', error);
            return message.reply('Veritabanı güncellenirken bir hata oluştu.');
        }

        // Embed ile bildirim gönder
        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(' Kelime Eklendi')
            .setDescription(`${username} adlı kullanıcıya **+${amount}** kelime eklendi.\nYeni toplam: **${weeklyData[userId].words}**`)
            .setFooter({ text: '༒ | Kelime sistemi' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};