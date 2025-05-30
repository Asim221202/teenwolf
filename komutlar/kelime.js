const { MessageEmbed } = require('discord.js');
const fs = require('fs');

let allowedChannels = [];
const kanalDosyasi = './data/kanalid.json';
const kelimeDosyasi = './data/kelimeVerisi.json';

// Kanalları güncelleyen fonksiyon
function updateAllowedChannels() {
    try {
        const channelData = JSON.parse(fs.readFileSync(kanalDosyasi, 'utf8'));
        allowedChannels = channelData.allowedChannels || [];
    } catch (error) {
        console.error('Kanallar veritabanı okunurken bir hata oluştu:', error);
    }
}

// Mesaj geldiğinde çağrılır
function trackWords(message) {
    if (message.author.bot) return;

    updateAllowedChannels();

    const channel = message.channel;
    if (!allowedChannels.includes(channel.id) && (!channel.parentId || !allowedChannels.includes(channel.parentId))) return;

    countWordsInChannel(message);
}

// Kelimeleri sayar ve dosyaya yazar
function countWordsInChannel(message) {
    const userId = message.author.id;
    const content = message.content.trim();
    const words = content.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount === 0) return;

    let data = {};
    try {
        data = JSON.parse(fs.readFileSync(kelimeDosyasi, 'utf8'));
    } catch (error) {
        console.error('Kelime verisi okunamadı, yeni dosya oluşturulacak.');
    }

    if (!data[userId]) {
        data[userId] = { words: 0 };
    }

    data[userId].words += wordCount;

    fs.writeFileSync(kelimeDosyasi, JSON.stringify(data, null, 2));
    console.log(`Kullanıcı ${message.author.username} (${userId}) ${wordCount} kelime yazdı. Toplam: ${data[userId].words}`);

}

// Toplam kelime sayısını gösteren embed fonksiyonu
function showWords(message, targetUser) {
    const userId = targetUser ? targetUser.id : message.author.id;

    let data = {};
    try {
        data = JSON.parse(fs.readFileSync(kelimeDosyasi, 'utf8'));
    } catch (error) {
        console.error('Kelime veritabanı okunamadı:', error);
        return message.reply('Kelime veritabanı okunurken bir hata oluştu.');
    }

    const totalWords = data[userId]?.words || 0;

    const embed = new MessageEmbed()
        .setColor('#ffffff')
        .setTitle('༒ Toplam Kelime Sayısı')
        .setDescription(`${targetUser ? targetUser.username : message.author.username} adlı kullanıcının toplam kelime sayısı: **${totalWords}**`)
        .setFooter({ text: '༒ | Kelime sistemi' })
        .setTimestamp()
        .setThumbnail((targetUser || message.author).displayAvatarURL({ dynamic: true }));

    message.reply({ embeds: [embed] });
}

module.exports = {
    name: 'kelime',
    description: 'Kullanıcının veya belirtilen bir kişinin toplam kelime sayısını gösterir.',
    execute(message, args) {
        const requiredRole = 'RolePlay Üye';

        if (!message.member.roles.cache.some(role => role.name === requiredRole)) {
            return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
        }

        const targetUser = message.mentions.users.first();
        if (targetUser && !message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('Başka bir kullanıcının kelime sayısını görmek için yetkiye sahip olmalısınız.');
        }

        showWords(message, targetUser);
    },
    messageCreate(message) {
        trackWords(message);
    }
};