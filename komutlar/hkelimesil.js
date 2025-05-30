const fs = require('fs');

module.exports = {
    name: 'hkelimesil',
    description: 'Belirtilen kullanıcının kelime sayısını siler veya azaltır.',
    async execute(message, args) {
        // Yetki kontrolü
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yetkiniz yok!');
        }

        const wordDataPath = './data/haftalikKelimeVerisi.json';
        let wordData = {};

        // Kelime verisini yükleme
        try {
            if (fs.existsSync(wordDataPath)) {
                wordData = JSON.parse(fs.readFileSync(wordDataPath, 'utf8'));
            } else {
                return message.reply('Kelime verisi dosyası bulunamadı!');
            }
        } catch (error) {
            console.error('Kelime verisi okuma hatası:', error);
            return message.reply('Kelime verisi okuma hatası oluştu.');
        }

        // Kullanıcı etiketini alma
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Lütfen bir kullanıcı etiketleyin.');
        }

        const userId = user.id; // Kullanıcının kimliğini al
        const amount = parseInt(args[1], 10); // Silinecek kelime sayısı

        if (isNaN(amount) || amount <= 0) {
            return message.reply('Lütfen geçerli bir miktar belirtin. Örnek: `.kelimesil @kullanıcı 500`');
        }

        // Kullanıcı kontrolü
      if (!wordData[userId] || typeof wordData[userId].words !== 'number') {
            return message.reply('Belirtilen kullanıcı kelime verisinde bulunamadı!');
        }

        // Kelime silme işlemi
        wordData[userId].words -= amount;
        if (wordData[userId].words < 0) wordData[userId].words = 0; // Negatif değeri sıfırlayın

        // Kullanıcının seviyesini güncelle
        const newLevel = Math.floor(wordData[userId].words / 1000);
        wordData[userId].level = newLevel;

        // Güncellenen veriyi kaydetme
        try {
            fs.writeFileSync(wordDataPath, JSON.stringify(wordData, null, 2));
        } catch (error) {
            console.error('Kelime verisi yazma hatası:', error);
            return message.reply('Kelime verisi kaydedilirken bir hata oluştu.');
        }

        // Başarı mesajı
        message.reply(
            `${user.username} kullanıcısının kelime sayısından ${amount} kelime silindi. Yeni toplam: ${wordData[userId].words}`
        );
    },
};