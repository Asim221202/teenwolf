const { MessageEmbed } = require('discord.js');
const fs = require('fs');

// Haftalık kelime sayımını takip eden fonksiyon
async function trackWords(message) {
    if (message.author.bot) return;

    let channelId = message.channel.id;

    // Eğer mesaj bir thread içinde ise, parent kanalını kontrol et
    if (message.channel.isThread()) {
        channelId = message.channel.parentId; // Thread'in bağlı olduğu ana kanalın ID'sini al
    }

    // Kanal ID'lerini dosyadan oku
    let allowedChannels;
    try {
        allowedChannels = JSON.parse(await fs.promises.readFile('./data/kanalid.json', 'utf8'));
        allowedChannels = allowedChannels.allowedChannels; // İç içe nesneden array'i al
    } catch (error) {
        console.error('Kanal ID\'leri okunamadı:', error);
        return;
    }

    // Eğer dosya hatalıysa veya array yoksa işlem yapma
    if (!Array.isArray(allowedChannels)) return;
    
    // Kanal ID'si izin verilenler listesinde mi?
    if (!allowedChannels.includes(channelId)) return;

    const userId = message.author.id;
    const content = message.content.trim();

    // Kelimeleri doğru şekilde sayma
    const words = content.split(/\s+/).filter(word => word.length > 0); // Boş karakterleri ayıkla
    const wordCount = words.length;

    if (wordCount === 0) return;

    // Haftalık kelime verisi
    let weeklyData;
    try {
        weeklyData = JSON.parse(await fs.promises.readFile('./data/haftalikKelimeVerisi.json', 'utf8'));
    } catch (error) {
        console.error('Haftalık kelime verisi okunamadı:', error);
        return;
    }

    // Haftalık veri güncelleme
    if (!weeklyData[userId]) {
        weeklyData[userId] = { words: 0 };
    }

    weeklyData[userId].words += wordCount;

    // JSON dosyasını güncelleme
    try {
        await fs.promises.writeFile('./data/haftalikKelimeVerisi.json', JSON.stringify(weeklyData, null, 2));
    } catch (error) {
        console.error('Haftalık kelime verisi yazılamadı:', error);
    }

    console.log(`Kullanıcı ${message.author.username} (${userId}) ${wordCount} kelime yazdı. Haftalık: ${weeklyData[userId].words}`);
}

// Haftalık kelime sayısını gösterme fonksiyonu
async function showWeeklyWords(message) {
    let userId = message.author.id;
    let username = message.author.username;

    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) {
        userId = mentionedUser.id;
        username = mentionedUser.username;
    }

    // Haftalık kelime verisini oku
    let weeklyData;
    try {
        weeklyData = JSON.parse(await fs.promises.readFile('./data/haftalikKelimeVerisi.json', 'utf8'));
    } catch (error) {
        console.error('Haftalık kelime verisi okunamadı:', error);
        return message.reply('Haftalık kelime veritabanı okunurken bir hata oluştu.');
    }

    const totalWeeklyWords = weeklyData[userId]?.words || 0;

    // Embed oluştur
    const embed = new MessageEmbed()
        .setColor('#ffffff')
        .setTitle('༒ Haftalık Kelime Sayısı')
        .setDescription(`${username} adlı kullanıcının haftalık kelime sayısı: **${totalWeeklyWords}**`)
        .setFooter({ text: '༒ | Kelime sistemi' })
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

    message.reply({ embeds: [embed] });
}

// messageCreate eventinde kelime sayma işlemi
module.exports = {
    name: 'hkelime',
    description: 'Kullanıcının haftalık kelime sayısını gösterir.',
    execute(message) {
        showWeeklyWords(message);
    },
    messageCreate: async (message) => {
        await trackWords(message);
    }
};