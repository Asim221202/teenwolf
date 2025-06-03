const { MessageEmbed } = require('discord.js');
// const mongoose = require('mongoose'); // Artık burada mongoose'a gerek yok

// Modelleri merkezi dosyalardan içe aktar
const Balance = require('../models/Balance'); // Yolunuzu projenizin yapısına göre ayarlayın
const LastClaimed = require('../models/LastClaimed'); // Yolunuzu projenizin yapısına göre ayarlayın

module.exports = {
    name: "günlük",
    description: "Günlük ödemenizi alın!",
    async execute(message) {
        function checkUserRole(roleName) {
            return message.member.roles.cache.some(role => role.name === roleName);
        }

        const roleName = 'RolePlay Üye';

        if (!checkUserRole(roleName)) {
            return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
        }

        const userId = message.author.id;
        const dailyAmount = 500; // Günlük ödeme miktarı
        const cooldown = 24 * 60 * 60 * 1000; // 24 saat

        try {
            // Son alınma zamanını kontrol et
            const lastClaimed = await LastClaimed.findById(userId);
            const now = Date.now();
            const remainingTime = cooldown - (now - (lastClaimed ? lastClaimed.lastClaimed : 0));

            if (remainingTime > 0) {
                const hours = Math.floor(remainingTime / 3600000);
                const minutes = Math.floor((remainingTime % 3600000) / 60000);
                return message.reply(`Günlük ödemenizi almak için biraz daha beklemeniz gerek. Kalan süre: **${hours} saat, ${minutes} dakika**`);
            }

            // Günlük ödeme işlemi
            await Balance.findByIdAndUpdate(
                userId,
                { $inc: { balance: dailyAmount } },
                { upsert: true, new: true }
            );

            // Son alınma zamanını güncelle
            await LastClaimed.findByIdAndUpdate(
                userId,
                { lastClaimed: now },
                { upsert: true, new: true }
            );

            return message.reply(`Tebrikler, günlük ödemenizi başarıyla aldınız! **${dailyAmount} para** cüzdanınıza eklendi.`);

        } catch (error) {
            console.error('Günlük ödeme işlemi sırasında bir hata oluştu:', error);
            return message.reply('Günlük ödeme alınırken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
};
