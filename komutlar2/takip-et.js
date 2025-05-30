const db = require('../database');
const { MessageEmbed } = require('discord.js');

const BILDirim_KANALI_ID = '1368146532842606703'; // Bildirimlerin gideceği kanalın ID'si

module.exports = {
    name: 'takip-et',
    description: 'Belirtilen kullanıcıyı takip etmeye başlar (kullanıcı adı veya etiket).',
    usage: '.takip-et <kullanıcı adı veya @kullanıcı>',
    async execute(message, args) {
        const takipEdenId = message.author.id;
        let takipEdenKullaniciAdi;
        const hedefKullaniciArg = args.join(' ').trim();
        let takipEdilenId;
        let takipEdilenAdi;

        // Takip eden kullanıcının adını veritabanından al
        const takipEdenVeri = await new Promise((resolve, reject) => {
            db.get(`SELECT kullaniciAdi FROM kullanicilar WHERE kullaniciId = ?`, [takipEdenId], (err, row) => {
                if (err) {
                    console.error('[takip-et] Takip eden kullanıcı kontrol edilirken hata:', err.message);
                    reject(err);
                }
                resolve(row);
            });
        });
        takipEdenKullaniciAdi = takipEdenVeri?.kullaniciAdi || message.author.tag;

        if (!hedefKullaniciArg) {
            return message.reply('Lütfen takip etmek istediğiniz kullanıcı adını veya etiketini belirtin.');
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
                        console.error('[takip-et] Hedef kullanıcı kontrol edilirken hata:', err.message);
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
                        console.error('[takip-et] Hedef kullanıcı kontrol edilirken hata:', err.message);
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

        if (takipEdenId === takipEdilenId) {
            return message.reply('Kendinizi takip edemezsiniz.');
        }

        db.get(`SELECT * FROM takip WHERE takipEdenId = ? AND takipEdilenId = ?`, [takipEdenId, takipEdilenId], (err, row) => {
            if (err) {
                console.error('[takip-et] Takip kontrol edilirken hata:', err.message);
                return message.reply('Takip işlemi gerçekleştirilirken bir hata oluştu.');
            }
            if (row) {
                return message.reply(`Zaten "${takipEdilenAdi}" adlı kullanıcıyı takip ediyorsunuz.`);
            }

            db.run(`INSERT INTO takip (takipEdenId, takipEdilenId) VALUES (?, ?)`, [takipEdenId, takipEdilenId], function(err) {
                if (err) {
                    console.error('[takip-et] Takip kaydedilirken hata:', err.message);
                    return message.reply('Takip işlemi gerçekleştirilirken bir hata oluştu.');
                }
                message.reply(`"${takipEdilenAdi}" adlı kullanıcıyı takip etmeye başladınız.`);
                console.log(`[takip-et] ${takipEdenKullaniciAdi} adlı kullanıcı ${takipEdilenAdi} adlı kullanıcıyı takip etti.`);

                // BİLDİRİM GÖNDERME
                const bildirimKanal = message.client.channels.cache.get(BILDirim_KANALI_ID);
                if (bildirimKanal) {
                    const bildirimEmbed = new MessageEmbed()
                        .setColor('#ffffff')
                        .setDescription(`**${takipEdenKullaniciAdi}** adlı kullanıcı seni takip etmeye başladı!`);
                    bildirimKanal.send({ content: `<@${takipEdilenId}> *yeni bir takipçiniz var!*`, embeds: [bildirimEmbed] })
                        .catch(error => console.error(`[takip-et] Bildirim gönderilirken hata:`, error));
                } else {
                    console.warn(`[takip-et] Bildirim kanalı (${BILDirim_KANALI_ID}) bulunamadı.`);
                }
            });
        });
    },
};
