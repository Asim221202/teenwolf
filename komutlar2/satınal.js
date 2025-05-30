const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'satınal',
  description: 'Ürün satın almanızı sağlar.',
  async execute(message, args) {
    function checkUserRole(roleName) {
      return message.member.roles.cache.some(role => role.name === roleName);
    }

    const roleName = 'RolePlay Üye';
    if (!checkUserRole(roleName)) {
      return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
    }

    const products = {
      "Eski Model Araba": 21000,
      "Standart Araba": 30000,
      "Motosiklet": 18000,
      "Spor Araba": 45000,
      "Müstakil Ev": 20000,
      "Dublex Ev": 30000,
      "Orman Evi": 40000,
      "Dağ Evi": 50000,
      "Villa": 100000,
      "Malikane": 500000,
      "Tabanca": 6000,
      "Sonsuz Tahta Mermi": 3000,
      "Arbalet": 3500,
      "Mine Çiçeği": 500,
      "Mine Bombası": 1500,
      "Kurtboğan": 500,
      "Mine Şırıngası": 1000,
      "Kurtboğan Bombası": 1500,
      "Kurtboğan Şırıngası": 1000,
      "Gün Işığı Takıları": 100,
      "Ay Işığı Takıları": 2000,
      "Gilbert Yüzüğü": 2500,
    };

    if (!args.length) {
      return message.reply("Lütfen satın almak istediğiniz ürünü yazın. Örnek: `.satınal Düşük Seviye Araçlar`");
    }

    const productName = args.join(" ");
    if (!products[productName]) {
      return message.reply("Geçerli bir ürün adı girin. Mevcut ürünler: " + Object.keys(products).join(", "));
    }

    const envanterPath = path.join(__dirname, '../data/envanter.json');
    const bakiyePath = path.join(__dirname, '../data/balances.json');

    let balancesData = JSON.parse(fs.readFileSync(bakiyePath, 'utf8'));
    let envanterData = JSON.parse(fs.readFileSync(envanterPath, 'utf8'));

    const userId = message.author.id;

    // Kullanıcı bakiyesi kontrolü
    if (!balancesData[userId]) {
      balancesData[userId] = { balance: 100000 };
    }

    if (!envanterData[userId]) {
      envanterData[userId] = { inventory: [] };
    }

    const userBalance = balancesData[userId].balance;
    const productPrice = products[productName];

    if (userBalance >= productPrice) {
      balancesData[userId].balance -= productPrice;
      envanterData[userId].inventory.push(productName);

      // Sadece ilgili dosyaları güncelle
      try {
        fs.writeFileSync(bakiyePath, JSON.stringify(balancesData, null, 2));
        fs.writeFileSync(envanterPath, JSON.stringify(envanterData, null, 2));

        const successEmbed = new MessageEmbed()
          .setTitle("Satın Alma Başarılı")
          .setDescription(`${productName} başarıyla satın alındı.\nYeni bakiyeniz: ${balancesData[userId].balance}$\nÜrün envanterinize eklendi.`)
          .setColor("GREEN");
        message.channel.send({ embeds: [successEmbed] });
      } catch (error) {
        return message.reply("Veritabanı güncellenirken bir hata oluştu: " + error.message);
      }
    } else {
      const insufficientEmbed = new MessageEmbed()
        .setTitle("Yetersiz Bakiye")
        .setDescription(`Ürün almak için yeterli bakiyeniz yok.\nMevcut bakiyeniz: ${userBalance}$`)
        .setColor("RED");
      message.channel.send({ embeds: [insufficientEmbed] });
    }
  }
};