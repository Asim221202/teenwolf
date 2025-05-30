const fs = require('fs').promises;

module.exports = {
    name: 'enuzunemote',
    description: 'Belirtilen kullanıcının en uzun kelime artışını gösterir.',
    usage: '.enuzunemote <@kullanıcı etiketi>',
    async execute(mesaj, args) {
        const enUzunEmoteDosyasi = './data/enUzunEmote.json';

        if (!args.length) {
            return mesaj.reply('Lütfen bir kullanıcı etiketleyin!');
        }

        const kullaniciEtiketi = args[0];
        const kullaniciIdRegex = /<@!?(\d+)>/;
        const kullaniciIdEslesmesi = kullaniciIdRegex.exec(kullaniciEtiketi);

        if (!kullaniciIdEslesmesi) {
            return mesaj.reply('Geçersiz kullanıcı etiketi!');
        }

        const hedefKullaniciId = kullaniciIdEslesmesi[1];

        try {
            const enUzunEmoteVerisiStr = await fs.readFile(enUzunEmoteDosyasi, 'utf8');
            const enUzunEmoteVerisi = JSON.parse(enUzunEmoteVerisiStr);

            if (enUzunEmoteVerisi[hedefKullaniciId]) {
                const kullaniciVerisi = enUzunEmoteVerisi[hedefKullaniciId];
                const hedefKullanici = await mesaj.client.users.fetch(hedefKullaniciId);
                const cevap = `**${hedefKullanici.tag}** kullanıcısının en uzun kelime artışı: **${kullaniciVerisi.fark}** (Son Güncelleme: ${new Date(kullaniciVerisi.sonGuncelleme).toLocaleString('tr-TR')})`;
                mesaj.channel.send(cevap);
            } else {
                mesaj.reply(`${kullaniciEtiketi} kullanıcısının henüz bir kelime artışı kaydedilmemiş.`);
            }

        } catch (hata) {
            console.error('En uzun emote verisi okunurken bir hata oluştu:', hata);
            mesaj.reply('En uzun emote verilerini alırken bir hata oluştu.');
        }
    },
};
