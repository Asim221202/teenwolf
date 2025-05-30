const db = require('../database');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'takip-ettiklerim',
    description: 'Takip ettiğiniz kullanıcıları listeler.',
    usage: '.takip-ettiklerim',
    async execute(message, args) {
        const kullaniciId = message.author.id;

        db.all(`
            SELECT t.takipEdilenId, k.kullaniciAdi
            FROM takip t
            INNER JOIN kullanicilar k ON t.takipEdilenId = k.kullaniciId
            WHERE t.takipEdenId = ?
        `, [kullaniciId], (err, takipEdilenler) => {
            if (err) {
                console.error('[takip-ettiklerim] Takip edilenler alınırken hata:', err.message);
                return message.reply('Takip ettiğiniz kullanıcılar görüntülenirken bir hata oluştu.');
            }

            if (takipEdilenler.length === 0) {
                return message.reply('Henüz kimseyi takip etmiyorsunuz.');
            }

            const takipEdilenListesi = takipEdilenler.map(takipEdilen => `- ${takipEdilen.kullaniciAdi}`).join('\n');
            const embed = new MessageEmbed()
              
                .setTitle(`${message.author.username}'in Takip Ettikleri`)
                .setDescription(takipEdilenListesi)
                .setFooter(`Toplam ${takipEdilenler.length} kişi takip ediliyor`);

            message.channel.send({ embeds: [embed] });
        });
    },
};
