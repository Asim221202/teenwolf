const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'ekle',
    description: 'Kullanıcıya mağazadan ürün ekler.',
    async execute(message, args) {
        // Yetki kontrolü
        const isAdmin = message.member.permissions.has("ADMINISTRATOR");
        if (!isAdmin) {
            return message.reply('Bu komutu kullanmak için yeterli yetkiniz yok.');
        }

        // Kullanıcı ve ürün parametrelerini al
        const kullanıcı = message.mentions.users.first();
        const ürün = args.slice(1).join(' '); // Ürünü args'lerden al

        // Kullanıcı veya ürün belirtilmemişse uyarı ver
        if (!kullanıcı || !ürün) {
            return message.reply('Lütfen bir kullanıcı ve ürün belirtin. Örnek: `.ekle @kullanıcı Malikane`');
        }

        // Mağaza ürünlerini tek tek kontrol et (sadece ürün isimleri)
        const allProducts = [
            "Eski Model Araba",
            "Standart Araba",
            "Motorsiklet",
            "Spor Araba",
            "Müstakil Ev",
            "Dublex Ev",
            "Orman Evi",
            "Dağ Evi",
            "Villa",
            "Malikane",
            "Tabanca",
            "Tahta Mermi",
            "Arbalet",
            "Mine Çiçeği",
            "Mine Bombası",
            "Kurtboğan",
            "Kurtboğan Bombası",
            "Kurtboğan Şırıngası",
            "Gün Işığı Takıları",
            "Ay Işığı Takıları",
            "Gilbert Yüzüğü"
        ];

        if (!allProducts.includes(ürün)) {
            return message.reply('Bu ürün mağazada mevcut değil. Lütfen geçerli bir ürün belirtin.');
        }

        // Kullanıcı dosyasının yolu
        const userFilePath = path.join(__dirname, '../data/envanter.json');

        // Kullanıcı dosyasını kontrol et
        let usersData = {};

        if (fs.existsSync(userFilePath)) {
            // Dosya varsa, veriyi oku
            usersData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
        }

        // Kullanıcı verisini almak
        const userId = kullanıcı.id;

        // Kullanıcı verisi yoksa, yeni bir kullanıcı ekle
        if (!usersData[userId]) {
            usersData[userId] = { inventory: [ürün] };
        } else {
            // Kullanıcı varsa, envantere ürün ekle
            if (!usersData[userId].inventory) {
                usersData[userId].inventory = [];
            }
            usersData[userId].inventory.push(ürün);
        }

        // Veriyi JSON formatında dosyaya yaz
        try {
            fs.writeFileSync(userFilePath, JSON.stringify(usersData, null, 2), 'utf8');
            // Başarı mesajı
            message.reply(`${kullanıcı.username} kullanıcısına ${ürün} ürünü başarıyla eklendi.`);
        } catch (error) {
            console.error(error);
            return message.reply('Bir hata oluştu, ürün eklenemedi.');
        }
    }
};