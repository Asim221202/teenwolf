const db = require('../database');

module.exports = {
    name: 'hesap-oluştur',
    description: 'Yeni bir Instagram hesabı oluşturur.',
    usage: '.hesap-oluştur <kullanıcı adı>',
    async execute(message, args) {
        const kullaniciAdi = args.join(' ').trim();
        const kullaniciId = message.author.id;

        if (!kullaniciAdi) {
            return message.reply('Lütfen oluşturmak istediğiniz kullanıcı adını belirtin.');
        }

        db.get(`SELECT * FROM kullanicilar WHERE kullaniciId = ?`, [kullaniciId], (err, row) => {
            if (err) {
                console.error('Hesap kontrol edilirken hata:', err.message);
                return message.reply('Hesap oluşturulurken bir hata oluştu.');
            }
            if (row) {
                return message.reply('Zaten bir hesabınız var.');
            }

            db.run(`INSERT INTO kullanicilar (kullaniciId, kullaniciAdi) VALUES (?, ?)`, [kullaniciId, kullaniciAdi], function(err) {
                if (err) {
                    console.error('Kullanıcı oluşturulurken hata:', err.message);
                    return message.reply('Hesap oluşturulurken bir hata oluştu.');
                }
                db.run(`INSERT INTO bio (kullaniciId) VALUES (?)`, [kullaniciId], function(err) {
                    if (err) {
                        console.error('Biyo oluşturulurken hata:', err.message);
                        return message.reply('Hesap oluşturulurken bir hata oluştu.');
                    }
                    message.reply(`Hesabınız başarıyla oluşturuldu! Kullanıcı adınız: ${kullaniciAdi}`);
                    console.log(`[hesap-olustur] Yeni hesap oluşturuldu: ${kullaniciAdi} (${kullaniciId})`);
                });
            });
        });
    },
};
