const db = require('../database');

module.exports = {
    name: 'isim-değiştir',
    description: 'Profilinizdeki kullanıcı adını değiştirir.',
    usage: '.isim-değiştir <yeni kullanıcı adı>',
    async execute(message, args) {
        const kullaniciId = message.author.id;
        const yeniKullaniciAdi = args.join(' ').trim().toLowerCase();

        if (!yeniKullaniciAdi) {
            return message.reply('Lütfen yeni kullanıcı adınızı belirtin.');
        }

        // Aynı kullanıcı adının başka bir kullanıcıda olup olmadığını kontrol et
        db.get(`SELECT kullaniciId FROM kullanicilar WHERE LOWER(kullaniciAdi) = ?`, [yeniKullaniciAdi], (err, row) => {
            if (err) {
                console.error('[isim-değiştir] Kullanıcı adı kontrol edilirken hata:', err.message);
                return message.reply('İsim değiştirilirken bir hata oluştu.');
            }

            if (row) {
                return message.reply(`"${yeniKullaniciAdi}" kullanıcı adı zaten kullanımda.`);
            }

            db.run(`UPDATE kullanicilar SET kullaniciAdi = ? WHERE kullaniciId = ?`, [yeniKullaniciAdi, kullaniciId], function(err) {
                if (err) {
                    console.error('[isim-değiştir] Kullanıcı adı güncellenirken hata:', err.message);
                    return message.reply('İsim değiştirilirken bir hata oluştu.');
                }
                message.reply(`Kullanıcı adınız başarıyla "${yeniKullaniciAdi}" olarak değiştirildi.`);
                console.log(`[isim-değiştir] ${message.author.tag} adlı kullanıcının adı "${yeniKullaniciAdi}" olarak değiştirildi.`);
            });
        });
    },
};
