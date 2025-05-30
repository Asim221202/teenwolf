const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Bakiye verisi dosyasının yolu
const balanceDataPath = path.join(__dirname, '../data/balances.json');

// Arcane ödülleri tanımlaması
const arcaneRewards = {
    '5-10': 300,
    '10-25': 500,
    '25-99': 1000,
    
    // Daha fazla aralık eklenebilir
};

// Bakiye ekleme fonksiyonu
function addBalance(userId, amount) {
    let balanceData = {};
    try {
        if (fs.existsSync(balanceDataPath)) {
            balanceData = JSON.parse(fs.readFileSync(balanceDataPath, 'utf8'));
        }
    } catch (error) {
        console.error('Bakiye verisi okuma hatası:', error);
    }

    if (!balanceData[userId]) {
        balanceData[userId] = { balance: 0 };
    }

    balanceData[userId].balance += amount;

    try {
        fs.writeFileSync(balanceDataPath, JSON.stringify(balanceData, null, 2));
    } catch (error) {
        console.error('Bakiye verisi yazma hatası:', error);
    }
}

// Arcane seviyesine göre ödül ekleme
function handleArcaneLevelMessage(message, requiredRoleId) {
    const member = message.mentions.members.first();
    if (!member || !member.roles.cache.has(requiredRoleId)) return;

    const levelMatch = message.content.match(/yeni levelin \*\*(\d+)\*\*/i);
    if (!levelMatch) return;

    const level = parseInt(levelMatch[1], 10);
    let reward = 0;

    // Arcane seviyelerine göre ödül aralığı kontrolü
    for (const [range, amount] of Object.entries(arcaneRewards)) {
        const [min, max] = range.split('-').map(Number);
        if (level >= min && level <= max) {  // Seviye min ve max arasında olmalı
            reward = amount;
            break;
        }
    }

    if (reward > 0) {
        addBalance(member.id, reward);

        // Embed Builder kullanarak mesaj oluşturuluyor
        const embed = new MessageEmbed()
            .setTitle('Seviye Ödülü!')
            .setDescription(`🎉 Tebrikler ${member.user.username}! Arcane botunda seviye **${level}** oldunuz. **${reward}$** ödül kazandınız!`)
            .setColor('GREEN')
            .setTimestamp();

        message.channel.send({ content: `<@${member.id}>`, embeds: [embed] });
    }
}

module.exports = { handleArcaneLevelMessage, addBalance };