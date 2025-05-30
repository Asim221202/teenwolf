const db = require('../database');
const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js'); // icons.js dosyasını import ettik

module.exports = {
    name: 'yorum',
    description: 'Belirtilen bir gönderiye yorum yapar.',
    usage: '.yorum <gönderi ID> <yorum metni>',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Doğru kullanım: `.yorum <gönderi ID> <yorum metni>`');
        }

        const gonderiId = args.shift(); // İlk argüman gönderi ID'si
        const yorumMetni = args.join(' ').trim();
        const kullaniciId = message.author.id;
        const kullaniciAdi = message.author.username;
        const yorumTarihi = new Date().toISOString();

        if (isNaN(gonderiId)) {
            return message.reply('Lütfen geçerli bir gönderi ID\'si belirtin.');
        }

        if (!yorumMetni) {
            return message.reply('Lütfen yorumunuzu yazın.');
        }

        db.get(`SELECT kanalId, mesajId, yazarId FROM gonderiler WHERE gonderiId = ?`, [gonderiId], (err, gonderi) => {
            if (err) {
                console.error('[yorum] Gönderi kontrol edilirken hata:', err.message);
                return message.reply('Yorum yapılamadı. Bir hata oluştu.');
            }
            if (!gonderi) {
                return message.reply(`"${gonderiId}" ID\'li bir gönderi bulunamadı.`);
            }

            db.run(`
                INSERT INTO yorumlar (gonderiId, yazarId, icerik, olusturmaTarihi)
                VALUES (?, ?, ?, ?)
            `, [gonderiId, kullaniciId, yorumMetni, yorumTarihi], function(err) {
                if (err) {
                    console.error('[yorum] Yorum veritabanına kaydedilirken hata:', err.message);
                    return message.reply('Yorum yapılamadı. Bir hata oluştu.');
                }
                message.react('💬'); // Yorum yapma başarılı emojisi
                console.log(`[yorum] ${kullaniciAdi} (${kullaniciId}), ${gonderiId} ID\'li gönderiye yorum yaptı: ${yorumMetni}`);

                // Yorumu gönderiye yanıt olarak gönderme (isteğe bağlı)
                const gonderiKanal = message.client.channels.cache.get(gonderi.kanalId);
                if (gonderiKanal && gonderi.mesajId) {
                    gonderiKanal.messages.fetch(gonderi.mesajId)
                        .then(gonderiMesaji => {
                            if (gonderiMesaji) {
                                const yorumEmbed = new MessageEmbed()
                                    .setColor('#ffffff')
                                    .setAuthor({ name: `${kullaniciAdi} yorum yaptı!`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                    .setDescription(yorumMetni)
                                    .setFooter('|', musicIcons.instagram)
                                    .setTimestamp(yorumTarihi);

                                gonderiMesaji.reply({ embeds: [yorumEmbed] })
                                    .catch(error => console.error('[yorum] Gönderiye yanıt verilirken bir hata oluştu:', error));
                            }
                        })
                        .catch(error => console.error('[yorum] Gönderi mesajı alınırken hata:', error));
                } else {
                    console.warn('[yorum] Gönderi kanalı veya mesaj ID\'si bulunamadı.');
                }
            });
        });
    },
};

module.exports.help = {
    name: 'yorum',
    description: 'Belirtilen bir gönderiye yorum yapar.',
    usage: '.yorum <gönderi ID> <yorum metni>',
};
