const fs = require('fs');
const path = require('path');

module.exports = {
  name: "günlük",
  description: "Günlük ödemenizi alın!",
  execute(message) {
      function checkUserRole(roleName) {
            return message.member.roles.cache.some(role => role.name === roleName);
        }

        // İstediğiniz rol adı (örneğin 'Admin' rolü)
        const roleName = 'RolePlay Üye';

        // Kullanıcının belirli bir rolü olup olmadığını kontrol et
        if (!checkUserRole(roleName)) {
            return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
        }
    const userId = message.author.id;
    const balancesFilePath = path.join(__dirname, '../data/balances.json');
    const lastClaimedFilePath = path.join(__dirname, '../data/lastClaimed.json');

    // Dosyaların varlığını kontrol et
    if (!fs.existsSync(balancesFilePath)) {
      fs.writeFileSync(balancesFilePath, JSON.stringify({}, null, 2));
    }

    if (!fs.existsSync(lastClaimedFilePath)) {
      fs.writeFileSync(lastClaimedFilePath, JSON.stringify({}, null, 2));
    }

    // Dosyayı okuma
    let balancesData = JSON.parse(fs.readFileSync(balancesFilePath, 'utf8'));
    let lastClaimedData = JSON.parse(fs.readFileSync(lastClaimedFilePath, 'utf8'));

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 saat
    const remainingTime = cooldown - (now - (lastClaimedData[userId] || 0));

    if (remainingTime > 0) {
      const hours = Math.floor(remainingTime / 3600000);
      const minutes = Math.floor((remainingTime % 3600000) / 60000);
      return message.reply(`Günlük ödemenizi almak için biraz daha beklemeniz gerek. Kalan süre: **${hours} saat, ${minutes} dakika**`);
    }

    // Günlük ödeme işlemi
    const dailyAmount = 500; // Günlük ödeme miktarı
    balancesData[userId] = balancesData[userId] || { balance: 0, bank: 0 };
    balancesData[userId].balance += dailyAmount;

    lastClaimedData[userId] = now;

    // Dosyaya yazma
    try {
      fs.writeFileSync(balancesFilePath, JSON.stringify(balancesData, null, 2));
      fs.writeFileSync(lastClaimedFilePath, JSON.stringify(lastClaimedData, null, 2));
      return message.reply(`Tebrikler, günlük ödemenizi başarıyla aldınız! **${dailyAmount} para** cüzdanınıza eklendi.`);
    } catch (error) {
      console.error('Veri dosyasına yazarken bir hata oluştu:', error);
      return message.reply('Veritabanına yazma hatası oluştu. Lütfen tekrar deneyin.');
    }
  }
};