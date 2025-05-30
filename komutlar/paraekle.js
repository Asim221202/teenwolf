const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "paraekle",
  description: "Bir kullanıcıya para ekler.",
  execute(message, args) {
    // Yetkili kontrolü
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply("Bu komutu kullanmak için yeterli yetkiniz yok.");
    }

    // Kullanıcıyı etiketleme kontrolü
    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      return message.reply("Para eklemek istediğiniz kullanıcıyı etiketlemelisiniz.");
    }

    // Eklenmek istenen miktarı kontrol et
    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) {
      return message.reply("Lütfen geçerli bir miktar girin.");
    }

    const userId = targetUser.id;

    // balances.json dosyasının yolu
    const filePath = path.join(__dirname, '../data', 'balances.json');

    // balances.json dosyasını kontrol et
    if (!fs.existsSync(filePath)) {
      // Eğer dosya yoksa yeni dosya oluştur
      const initialData = {};
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    }

    // balances.json dosyasını oku
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      return message.reply("Veritabanı okunurken bir hata oluştu: " + error.message);
    }

    // Kullanıcı verisini al veya yeni oluştur
    const userData = data[userId] || { balance: 0, bank: 0 };

    // Kullanıcının bakiyesini artır
    userData.balance += amount;

    // Güncellenmiş veriyi kaydet
    data[userId] = userData;
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      return message.reply("Veritabanı yazılırken bir hata oluştu: " + error.message);
    }

    // Kullanıcıya başarı mesajı gönder
    const embed = new MessageEmbed()
      
      .setTitle('')
      .setDescription(`${targetUser.username} kullanıcısına başarıyla ${amount} para eklendi.`)
 
      .setFooter(`${amount} para eklendi.`)
      .setTimestamp()
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));

    return message.reply({ embeds: [embed] });
  }
};