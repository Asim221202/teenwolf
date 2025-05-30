const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'sil',
    description: 'Kullanıcının envanterinden bir ürünü siler.',
    async execute(message, args) {
        // Yetki kontrolü
        const isAdmin = message.member.permissions.has("ADMINISTRATOR");
        if (!isAdmin) {
            return message.reply('Bu komutu kullanmak için yeterli yetkiniz yok.');
        }

        // Kullanıcı ve ürün parametrelerini al
        const kullanıcı = message.mentions.users.first();
        const ürün = args.slice(1).join(' ');

        // Kullanıcı ve ürün belirtilmemişse uyarı ver
        if (!kullanıcı || !ürün) {
            return message.reply('Lütfen bir kullanıcı ve ürün belirtin. Örnek: `.sil @kullanıcı Malikane`');
        }

        // Kullanıcı dosyasının yolu
        const userFilePath =path.join(__dirname, '../data/envanter.json');

        if (!fs.existsSync(userFilePath)) {
            return message.reply('Kullanıcı verisi bulunamadı.');
        }

        const usersData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

        if (!usersData[kullanıcı.id] || !usersData[kullanıcı.id].inventory) {
            return message.reply(`${kullanıcı.username} kullanıcısının envanteri bulunmuyor.`);
        }

        // Envanteri güncelle
        const inventory = usersData[kullanıcı.id].inventory;
        const productIndex = inventory.indexOf(ürün);

        if (productIndex === -1) {
            return message.reply(`${kullanıcı.username} kullanıcısının envanterinde ${ürün} ürünü bulunmuyor.`);
        }

        // Ürünü envanterden sil
        inventory.splice(productIndex, 1);

        // Veriyi kaydet
        fs.writeFile(userFilePath, JSON.stringify(usersData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return message.reply('Bir hata oluştu, ürün silinemedi.');
            }

            message.reply(`${kullanıcı.username} kullanıcısının envanterinden ${ürün} ürünü başarıyla silindi.`);
        });
    }
};