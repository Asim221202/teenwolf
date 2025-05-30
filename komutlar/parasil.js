const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "parasil",
  description: "Belirli bir kullanıcıdan para çeker (cüzdan ve bankadaki toplam parayı hesaba katar).",
  async execute(message, args) {
    // Yetki kontrolü
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("Bu komutu kullanmak için yetkiniz yok.");
    }

    // Argüman kontrolü
    if (args.length < 2) {
      return message.reply("Lütfen silmek istediğiniz miktarı ve kullanıcıyı belirtin. Örnek: `!parasil @kullanıcı 100`");
    }

    // Etiketli kullanıcıyı al
    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      return message.reply("Bakiyesinden para çekmek istediğiniz kullanıcıyı etiketlemelisiniz.");
    }

    // Silinecek miktarı al
    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) {
      return message.reply("Lütfen geçerli bir para miktarı girin.");
    }

    const userId = targetUser.id;

    // Veritabanı dosya yolu
    const filePath = path.join(__dirname, '../data', 'balances.json');

    // Veritabanı dosyasını kontrol et
    if (!fs.existsSync(filePath)) {
      // Dosya yoksa oluştur ve bilgi ver
      const initialData = {};
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
      return message.reply("Veritabanı dosyası bulunamadı, yeni dosya oluşturuldu.");
    }

    // Veritabanını oku
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      return message.reply("Veritabanı okunurken bir hata oluştu: " + error.message);
    }

    // Kullanıcı verisi yoksa varsayılan değerlerle başlat
    const userData = data[userId] || { balance: 0, bank: 0 };

    // Kullanıcının toplam bakiyesini hesapla
    const totalBalance = userData.balance + userData.bank;

    // Kullanıcının toplam bakiyesi yeterli değilse hata mesajı göster
    if (totalBalance < amount) {
      return message.reply(
        `${targetUser.username} adlı kullanıcının yeterli parası yok. Mevcut toplam bakiyesi: ${totalBalance}`
      );
    }

    // Silme işlemi
    let remainingAmount = amount;

    if (userData.balance >= remainingAmount) {
      userData.balance -= remainingAmount;
      remainingAmount = 0;
    } else {
      remainingAmount -= userData.balance;
      userData.balance = 0;
    }

    if (remainingAmount > 0) {
      userData.bank -= remainingAmount;
    }

    // Güncellenmiş veriyi kaydet
    data[userId] = userData;
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      return message.reply("Veritabanı yazılırken bir hata oluştu: " + error.message);
    }

    // Başarı mesajı
    const embed = new MessageEmbed()
      .setDescription(
        `${targetUser.username} adlı kullanıcıda ${amount} para silindi.`  )
      .setFooter(`${amount} para silindi.`)
    
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    return message.reply({ embeds: [embed] });
  }
};