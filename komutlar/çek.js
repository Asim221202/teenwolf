const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "çek",
  description: "Bankadan parayı çeker ve cüzdana ekler.",
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

    // Banka bakiyesi yeterli mi?
    if (userData.bank < amount) {
      return message.reply("Banka bakiyenizde bu kadar para bulunmuyor.");
    }

    // Bankadan para çek ve cüzdana ekle
    userData.bank -= amount;
    userData.balance += amount;

    // Veritabanını güncelle
    data[userId] = userData;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // Embed mesajı oluştur
    const embed = new MessageEmbed()
      
      .setTitle('Başarıyla Para Çekildi!')
      .setDescription(`${amount} para bankadan çekildi.\nYeni cüzdan bakiyeniz: ${userData.balance} para\nYeni banka bakiyeniz: ${userData.bank} para`)
      .setTimestamp()
      .setFooter({ text: 'Banka işlemi başarıyla tamamlandı.' })
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setImage('https://media1.tenor.com/m/56YMc63ICdEAAAAd/money-kayy.gif'); // GIF'i buraya ekledim.

    // Embed mesajını gönder
    return message.reply({ embeds: [embed] });
  }
};