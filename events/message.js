const fs = require('fs');
const stats = require('../stats.json');

module.exports = (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;
    const words = message.content.split(/\s+/).length;

    const userStats = stats[userId] || { totalWords: 0, stats: 0, role: "Vampir" }; // Varsayılan rol
    userStats.totalWords += words;

    if (userStats.totalWords >= 100) {
        const gainedStats = Math.floor(userStats.totalWords / 100);
        userStats.stats += gainedStats;
        userStats.totalWords %= 100; // Kalan kelimeler
        message.channel.send(`${message.author.username}, ${gainedStats} stat puanı kazandınız! Mevcut statlar: ${userStats.stats}`);
    }

    stats[userId] = userStats;
    fs.writeFileSync('./stats.json', JSON.stringify(stats, null, 2));
};
module.exports = {
    name: 'message',
    execute(message) {
        if (message.author.bot) return;

        // Komut kontrolü ve işleme
        if (message.content.startsWith('!komut')) {
            message.reply('Komut çalıştı!');
        }
    },
};