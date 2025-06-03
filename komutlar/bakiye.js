const { MessageEmbed } = require('discord.js');
// const mongoose = require('mongoose'); // Artık burada mongoose'a gerek yok

// Modeli merkezi dosyadan içe aktar
const Balance = require('../models/Balance'); // Yolunuzu projenizin yapısına göre ayarlayın

// --- MongoDB ile etkileşim fonksiyonları ---
async function getUserBalance(userId) {
    try {
        const userBalance = await Balance.findById(userId);
        return userBalance ? { balance: userBalance.balance, bank: userBalance.bank } : { balance: 0, bank: 0 };
    } catch (error) {
        console.error(`Kullanıcı bakiyesi alınırken hata oluştu (${userId}):`, error);
        return { balance: 0, bank: 0 };
    }
}

// Bu fonksiyonu diğer komutlarınızda (para verme, para çekme vb.) kullanabilirsiniz.
async function updateUserBalance(userId, walletChange = 0, bankChange = 0) {
    try {
        await Balance.findByIdAndUpdate(
            userId,
            { $inc: { balance: walletChange, bank: bankChange } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        // console.log(`${userId} kullanıcısının bakiyesi güncellendi.`);
    } catch (error) {
        console.error(`Kullanıcı bakiyesi güncellenirken hata oluştu (${userId}):`, error);
    }
}

module.exports = {
    name: "bakiye",
    description: "Kullanıcının cüzdan ve banka bakiyesini gösterir. Yetkililer başkalarının bakiyesini görebilir.",
    async execute(message, args) { // Asenkron hale getirildi
        function checkUserRole(roleName) {
            return message.member.roles.cache.some(role => role.name === roleName);
        }

        const roleName = 'RolePlay Üye';

        if (!checkUserRole(roleName)) {
            return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
        }

        const userId = message.author.id;
        const targetUser = message.mentions.users.first();
        const isAdmin = message.member.permissions.has("ADMINISTRATOR");

        let targetId = userId;
        if (targetUser) {
            if (!isAdmin) {
                return message.reply("Başkasının bakiyesini görmek için yetkiniz yok.");
            }
            targetId = targetUser.id;
        }

        const { balance, bank } = await getUserBalance(targetId);
        const username = targetUser ? targetUser.username : message.author.username;

        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle('༒ The Other Side')
            .setDescription(`**${username}** kullanıcısının bakiye bilgileri:`)
            .addField('Cüzdan Bakiyesi:', `${balance} $`, true)
            .addField('Banka Bakiyesi:', `${bank} $`, true)
            .setFooter({ text: '༒ | Ekonomi Sistemi' })
            .setTimestamp()
            .setThumbnail((targetUser || message.author).displayAvatarURL({ dynamic: true }))
            .setImage('https://media1.tenor.com/images/8c15cf2457f96b0b59e9e41b4d40c229/tenor.gif');

        return message.reply({ embeds: [embed] });
    }
};
