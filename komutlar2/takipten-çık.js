const db = require('../database');

module.exports = {
    name: 'takipten-çık',
    description: 'Belirtilen kullanıcının takibini bırakır (kullanıcı adı veya etiket).',
    usage: '.takipten-çık <kullanıcı adı veya @kullanıcı>',
    async execute(message, args) {
        const takipEdenId = message.author.id;
        const hedefKullaniciArg = args.join(' ').trim();
        let takipEdilenId;
        let takipEdilenAdi;

        if (!hedefKullaniciArg) {
            return message.reply('Lütfen takibini bırakmak istediğiniz kullanıcı adını veya etiketini belirtin.');
        }

        const kullaniciEtiketiRegex = /^<@!?(\d+)>$/;
        const etiketEslesmesi = hedefKullaniciArg.match(kullaniciEtiketiRegex);

        if (etiketEslesmesi) {
            takipEdilenId = etiketEslesmesi[1];
            const hedefKullaniciDiscord = message.client.users.cache.get(takipEdilenId);
            if (!hedefKullaniciDiscord) {
                return message.reply('Belirtilen Discord kullanıcısı bulunamadı.');
            }
            takipEdilenAdi = hedefKullaniciDiscord.username;

            const hedefKullaniciVeri = await new Promise((resolve, reject) => {
                db.get(`SELECT kullaniciId, kullaniciAdi FROM kullanicilar WHERE kullaniciId = ?`, [takipEdilenId], (err, row) => {
                    if (err) {
                        console.error('[takipten-çık] Hedef kullanıcı kontrol edilirken hata:', err.message);
                        reject(err);
                    }
                    resolve(row);
                });
            });

            if (!hedefKullaniciVeri) {
                return message.reply(`"${takipEdilenAdi}" adlı kullanıcının hesabı bulunmuyor.`);
            }
            takipEdilenAdi = hedefKullaniciVeri.kullaniciAdi;

        } else {
            takipEdilenAdi = hedefKullaniciArg.toLowerCase();
            const hedefKullaniciVeri = await new Promise((resolve, reject) => {
                db.get(`SELECT kullaniciId, kullaniciAdi FROM kullanicilar WHERE LOWER(kullaniciAdi) = ?`, [takipEdilenAdi], (err, row) => {
                    if (err) {
                        console.error('[takipten-çık] Hedef kullanıcı kontrol edilirken hata:', err.message);
                        reject(err);
                    }
                    resolve(row);
                });
            });

            if (!hedefKullaniciVeri) {
                return message.reply(`"${hedefKullaniciArg}" adında bir kullanıcı bulunamadı.`);
            }
            takipEdilenId = hedefKullaniciVeri.kullaniciId;
            takipEdilenAdi = hedefKullaniciVeri.kullaniciAdi;
        }

        db.get(`SELECT * FROM takip WHERE takipEdenId = ? AND takipEdilenId = ?`, [takipEdenId, takipEdilenId], (err, row) => {
            if (err) {
                console.error('[takipten-çık] Takip kontrol edilirken hata:', err.message);
                return message.reply('Takibi bırakma işlemi gerçekleştirilirken bir hata oluştu.');
            }
            if (!row) {
                return message.reply(`"${takipEdilenAdi}" adlı kullanıcıyı zaten takip etmiyorsunuz.`);
            }

            db.run(`DELETE FROM takip WHERE takipEdenId = ? AND takipEdilenId = ?`, [takipEdenId, takipEdilenId], function(err) {
                if (err) {
                    console.error('[takipten-çık] Takip bırakılırken hata:', err.message);
                    return message.reply('Takibi bırakma işlemi gerçekleştirilirken bir hata oluştu.');
                }
                message.reply(`"${takipEdilenAdi}" adlı kullanıcının takibini bıraktınız.`);
                console.log(`[takipten-çık] ${message.author.tag} adlı kullanıcı ${takipEdilenAdi} adlı kullanıcının takibini bıraktı.`);
            });
        });
    },
};
