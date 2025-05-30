const db = require('../database');
const { MessageEmbed } = require('discord.js');
const musicIcons = require('../icons.js'); // icons.js dosyasını import ettik

module.exports = {
    name: 'hesap',
    description: 'Belirtilen kullanıcının profilini görüntüler.',
    usage: '.hesap [@kullanıcı]',
    async execute(message, args) {
        const hedefKullaniciId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;

        db.get(`
            SELECT k.kullaniciAdi, k.profilFoto, b.bio
            FROM kullanicilar k
            LEFT JOIN bio b ON k.kullaniciId = b.kullaniciId
            WHERE k.kullaniciId = ?
        `, [hedefKullaniciId], (err, kullanici) => {
            if (err) {
                console.error('Profil bilgileri alınırken hata:', err.message);
                return message.reply('Profil görüntülenirken bir hata oluştu.');
            }
            if (!kullanici) {
                return message.reply('Bu kullanıcının hesabı bulunmuyor.');
            }

            db.all(`SELECT COUNT(*) AS takipci FROM takip WHERE takipEdilenId = ?`, [hedefKullaniciId], (err, takipciSonuc) => {
                if (err) {
                    console.error('Takipçi sayısı alınırken hata:', err.message);
                    return message.reply('Profil görüntülenirken bir hata oluştu.');
                }
                const takipciSayisi = takipciSonuc[0].takipci;

                db.all(`SELECT COUNT(*) AS takipEdilen FROM takip WHERE takipEdenId = ?`, [hedefKullaniciId], (err, takipEdilenSonuc) => {
                    if (err) {
                        console.error('Takip edilen sayısı alınırken hata:', err.message);
                        return message.reply('Profil görüntülenirken bir hata oluştu.');
                    }
                    const takipEdilenSayisi = takipEdilenSonuc[0].takipEdilen;

                    const profilEmbed = new MessageEmbed()
                        .setColor('#ffffff')
                        .setAuthor({ name: kullanici.kullaniciAdi, iconURL: message.client.users.cache.get(hedefKullaniciId)?.displayAvatarURL({ dynamic: true }) })
                        .setDescription(kullanici.bio || 'Bu kullanıcının biyografisi yok.')
                        .addFields(
                            { name: 'Takipçi', value: takipciSayisi.toString(), inline: true },
                            { name: 'Takip Edilen', value: takipEdilenSayisi.toString(), inline: true }
                        )
                        .setFooter('|',musicIcons.instagram)
                        .setThumbnail(kullanici.profilFoto)
                        .setTimestamp();

                    message.channel.send({ embeds: [profilEmbed] });
                });
            });
        });
    },
};
