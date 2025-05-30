const fs = require('fs');
const path = require('path');

// Dosya yolları
const balancesPath = path.resolve(__dirname, '../data/balances.json'); // Bakiyeler
const bgLastClaimedPath = path.resolve(__dirname, '../data/bgLastClaimed.json'); // Booster günlük ödül zamanları

module.exports = {
    name: 'bgünlük',
    description: 'Boosterlara özel günlük ödül komutu.',
    async execute(message) {
        const boosterRoleId = '1327637020767555626'; // Booster rol ID
        const userId = message.author.id;

        // Kullanıcının booster olup olmadığını kontrol et
        if (!message.member.roles.cache.has(boosterRoleId)) {
            return message.reply('Bu komutu sadece booster rolüne sahip kullanıcılar kullanabilir!');
        }

        // JSON dosyalarını yükle veya oluştur
        let balances = {};
        let bgLastClaimed = {};

        // Verileri yükle
        try {
            if (fs.existsSync(balancesPath)) {
                balances = JSON.parse(fs.readFileSync(balancesPath, 'utf8'));
            }
            if (fs.existsSync(bgLastClaimedPath)) {
                bgLastClaimed = JSON.parse(fs.readFileSync(bgLastClaimedPath, 'utf8'));
            }
        } catch (error) {
            console.error('JSON dosyaları yüklenirken hata oluştu:', error);
            return message.reply('Veriler yüklenirken bir hata oluştu. Lütfen yöneticinize bildirin.');
        }

        // Günlük ödül alım kontrolü
        const now = Date.now();
        const lastClaimTime = bgLastClaimed[userId] || 0;

        if (now - lastClaimTime < 86400000) { // 24 saat (ms cinsinden)
            const remainingTime = 86400000 - (now - lastClaimTime);
            const hours = Math.floor(remainingTime / 3600000);
            const minutes = Math.floor((remainingTime % 3600000) / 60000);
            return message.reply(`Günlük ödülünü tekrar almak için **${hours} saat ${minutes} dakika** beklemelisin.`);
        }

        // Kullanıcıya 1000 para ekle
        if (!balances[userId]) {
            balances[userId] = {
                balance: 0,
                bank: 0
            };
        }
        balances[userId].balance += 1000; // Kullanıcının bakiyesine 1000 para ekle

        // Kullanıcının son ödül alım zamanını kaydet
        bgLastClaimed[userId] = now;

        // Verileri JSON dosyalarına kaydet
        try {
            fs.writeFileSync(balancesPath, JSON.stringify(balances, null, 2), 'utf8');
            fs.writeFileSync(bgLastClaimedPath, JSON.stringify(bgLastClaimed, null, 2), 'utf8');
        } catch (error) {
            console.error('JSON dosyaları kaydedilirken hata oluştu:', error);
            return message.reply('Veriler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
        }

        // Başarı mesajı
        return message.reply(`Tebrikler, günlük ödemenizi başarıyla aldınız! Booster rolüne özel **1000 para** cüzdanınıza eklendi.`);
    }
};