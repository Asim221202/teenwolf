const db = require('../database');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'takipçilerim',
    description: 'Sizi takip eden kullanıcıları listeler.',
    usage: '.takipçilerim',
    async execute(message, args) {
        const kullaniciId = message.author.id;

        db.all(`
            SELECT t.takipEdenId, k.kullaniciAdi
            FROM takip t
            INNER JOIN kullanicilar k ON t.takipEdenId = k.kullaniciId
            WHERE t.takipEdilenId = ?
        `, [kullaniciId], (err, takipciler) => {
            if (err) {
                console.error('[takipçilerim] Takipçiler alınırken hata:', err.message);
                return message.reply('Takipçileriniz görüntülenirken bir hata oluştu.');
            }

            if (takipciler.length === 0) {
                return message.reply('Henüz kimse sizi takip etmiyor.');
            }

            const takipciListesi = takipciler.map(takipci => `- ${takipci.kullaniciAdi}`).join('\n');
            const embed = new MessageEmbed()
    
                .setTitle(`${message.author.username}'in Takipçileri`)
                .setDescription(takipciListesi)
                .setFooter(`Toplam ${takipciler.length} takipçi`);

            message.channel.send({ embeds: [embed] });
        });
    },
};
