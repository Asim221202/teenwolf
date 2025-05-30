const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "yatır",
  description: "Cüzdandaki parayı bankaya yatırır.",
  execute(message, args) {
    // Kullanıcıda belirli bir rol olup olmadığını kontrol etmek için fonksiyon
        function checkUserRole(roleName) {
            return message.member.roles.cache.some(role => role.name === roleName);
        }

        // İstediğiniz rol adı (örneğin 'Admin' rolü)
        const roleName = 'RolePlay Üye';

        // Kullanıcının belirli bir rolü olup olmadığını kontrol et
        if (!checkUserRole(roleName)) {
            return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
        }

        // Komutun geri kalan işlevselliği burada yer alacak
        // Örnek olarak bir mesaj gönderelim

    
    const userId = message.author.id;
    const filePath = path.join(__dirname, '../data', 'balances.json');
    const amount = parseInt(args[0]);

    // Geçerli bir miktar girildiğinden emin ol
    if (isNaN(amount) || amount <= 0) {
      return message.reply("Lütfen geçerli bir miktar girin.");
    }

    // Veritabanı dosyasının var olup olmadığını kontrol et
    if (!fs.existsSync(filePath)) {
      const initialData = {};
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
      return message.reply("Veritabanı dosyası bulunamadı, yeni dosya oluşturuldu.");
    }

    // JSON dosyasını oku ve parse et
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const userData = data[userId] || { balance: 0, bank: 0 };

    // Cüzdan bakiyesi yeterli mi?
    if (userData.balance < amount) {
      return message.reply("Cüzdanınızda bu kadar para bulunmuyor.");
    }

    // Cüzdandan para çek ve bankaya yatır
    userData.balance -= amount;
    userData.bank += amount;

    // Veritabanını güncelle
    data[userId] = userData;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // Embed mesajı oluştur
    const embed = new MessageEmbed()
        .setTitle('Başarıyla Para Yatırıldı!')
      .setDescription(`${amount} para bankaya yatırıldı.\nYeni cüzdan bakiyeniz: ${userData.balance} para\nYeni banka bakiyeniz: ${userData.bank} para`)
      .setTimestamp()
      .setFooter('Banka işlemi başarıyla tamamlandı.')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setImage('https://media1.tenor.com/m/56YMc63ICdEAAAAd/money-kayy.gif');
    // Embed mesajını gönder
    return message.reply({ embeds: [embed] });
  }
};