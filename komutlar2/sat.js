const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'sat',
    description: 'Kendi envanterindeki bir ürünü satarsın.',
    async execute(message, args) {
        // Kullanıcı ve ürün parametrelerini al
        const ürün = args.slice(0).join(' '); // Ürün adı argüman olarak alınıyor

        if (!ürün) {
            return message.reply('Lütfen satmak istediğiniz ürünü belirtin. Örnek: `.sat Malikane`');
        }

        // Mağaza ürün fiyatları
        const productPrices = {
            "Eski Model Araba": 20000,
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
           
            "Arbalet": 3500,
           
           
          
            "Gün Işığı Takıları": 1000,
            "Ay Işığı Takıları": 2000,
            "Gilbert Yüzüğü": 2500
        };

        // Kullanıcı dosyasının yolu
        const envanterFilePath = path.join(__dirname, '..', 'data', 'envanter.json');
        const balancesFilePath = path.join(__dirname, '..', 'data', 'balances.json');

        // Eğer envanter dosyası yoksa hata mesajı
        if (!fs.existsSync(envanterFilePath)) {
            return message.reply('Envanter verisi bulunamadı.');
        }

        // Kullanıcıların verilerini oku
        const envanterData = JSON.parse(fs.readFileSync(envanterFilePath, 'utf8'));
        const balancesData = JSON.parse(fs.readFileSync(balancesFilePath, 'utf8'));

        const userId = message.author.id;

        // Kullanıcı verisi yoksa hata mesajı
        if (!envanterData[userId] || !envanterData[userId].inventory || envanterData[userId].inventory.length === 0) {
            return message.reply('Envanterinizde ürün bulunmuyor.');
        }

        // Ürünü envanterden güncelle
        const inventory = envanterData[userId].inventory;
        const productIndex = inventory.indexOf(ürün);

        if (productIndex === -1) {
            return message.reply('Envanterinizde belirtilen ürün bulunmuyor.');
        }

        // Ürünü envanterden sil
        inventory.splice(productIndex, 1);

        // Ürün fiyatını al
        const productPrice = productPrices[ürün] || 0;
        if (productPrice > 0) {
            // Kullanıcının bakiyesi yoksa oluştur
            if (!balancesData[userId]) {
                balancesData[userId] = { balance: 0 };
            }

            // Bakiyeyi artır
            balancesData[userId].balance += productPrice;
        }

        // Veriyi kaydet
        try {
            fs.writeFileSync(envanterFilePath, JSON.stringify(envanterData, null, 2));
            fs.writeFileSync(balancesFilePath, JSON.stringify(balancesData, null, 2));

            message.reply(`Ürününüz (${ürün}) satıldı ve ${productPrice}$ bakiyenize eklendi.`);
        } catch (err) {
            console.error(err);
            return message.reply('Bir hata oluştu, ürün satılamadı.');
        }
    }
};