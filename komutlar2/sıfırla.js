const fs = require('fs');

module.exports = {
  name: 'sıfırla',
  description: 'Haftalık kelime verilerini sıfırlar.',
  async execute(message) {
    const filePath = './data/haftalikKelimeVerisi.json';

    // Kullanıcıların sıfırlama komutunu kullanabilmesi için yetki kontrolü
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız.');
    }

    // Eğer dosya mevcut değilse, mesajla kullanıcıyı bilgilendiriyoruz
    if (!fs.existsSync(filePath)) {
      return message.reply('Haftalık kelime veritabanı bulunamadı.');
    }

    // JSON dosyasını sıfırlama işlemi
    try {
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
      return message.reply('Haftalık kelime verileri başarıyla sıfırlandı.');
    } catch (error) {
      console.error('Dosya sıfırlama hatası:', error);
      return message.reply('Veri sıfırlama sırasında bir hata oluştu.');
    }
  },
};