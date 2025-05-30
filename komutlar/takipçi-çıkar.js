const kullanicilar = require('../data/kullanicilar.json');
const fs = require('node:fs/promises');
const path = require('node:path');

module.exports = {
    name: 'takipçi-çıkar',
    description: 'Belirtilen kullanıcıyı takipçilerinizden çıkarır.',
    usage: '!takipci-cikar <@kullanıcıetiketi | instagram_kullanici_adi>',
    async execute(message, args) {
        if (args.length !== 1) {
            return message.reply('Doğru kullanım: `!takipci-cikar <@kullanıcıetiketi | instagram_kullanici_adi>`');
        }

        const hedefKullaniciEtiketi = message.mentions.users.first();
        const kullaniciId = message.author.id;
        let cikarilacakKullaniciId;
        let cikarilacakKullaniciAdi;

        if (!kullanicilar[kullaniciId]) {
            return message.reply('Önce bir hesap oluşturmalısınız! `!hesap-olustur <kullanıcı_adı>`');
        }

        if (hedefKullaniciEtiketi) {
            cikarilacakKullaniciId = hedefKullaniciEtiketi.id;
            cikarilacakKullaniciAdi = hedefKullaniciEtiketi.username;
        } else {
            const hedefKullaniciAdiArg = args[0];
            for (const userId in kullanicilar) {
                if (kullanicilar[userId].kullaniciAdi === hedefKullaniciAdiArg) {
                    cikarilacakKullaniciId = userId;
                    cikarilacakKullaniciAdi = hedefKullaniciAdiArg;
                    break;
                }
            }
            if (!cikarilacakKullaniciId) {
                return message.reply(`"${hedefKullaniciAdiArg}" adında bir kullanıcı bulunamadı.`);
            }
        }

        if (cikarilacakKullaniciId === kullaniciId) {
            return message.reply('Kendinizi takipçilerinizden çıkaramazsınız.');
        }

        if (!kullanicilar[cikarilacakKullaniciId]) {
            return message.reply('Bu kullanıcının henüz bir hesabı yok.');
        }

        if (!kullanicilar[kullaniciId].takipciler || !kullanicilar[kullaniciId].takipciler.includes(cikarilacakKullaniciId)) {
            return message.reply(`${cikarilacakKullaniciAdi} zaten sizi takip etmiyor.`);
        }

        // Kullanıcının takipçilerinden çıkar
        kullanicilar[kullaniciId].takipciler = kullanicilar[kullaniciId].takipciler.filter(id => id !== cikarilacakKullaniciId);

        // Çıkarılan kullanıcının takip ettiklerinden çıkar (isteğe bağlı ama mantıklı olabilir)
        if (kullanicilar[cikarilacakKullaniciId].takipEdilenler && kullanicilar[cikarilacakKullaniciId].takipEdilenler.includes(kullaniciId)) {
            kullanicilar[cikarilacakKullaniciId].takipEdilenler = kullanicilar[cikarilacakKullaniciId].takipEdilenler.filter(id => id !== kullaniciId);
        }

        const filePath = path.join(__dirname, '..', 'data', 'kullanicilar.json');
        try {
            await fs.writeFile(filePath, JSON.stringify(kullanicilar, null, 2));
            message.reply(`${cikarilacakKullaniciAdi} başarıyla takipçilerinizden çıkarıldı.`);
            console.log('Kullanıcılar güncellendi (takipçi çıkar):', kullanicilar);
        } catch (error) {
            console.error('kullanicilar.json dosyasına yazılırken bir hata oluştu:', error);
            message.reply('Takipçi çıkarılırken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    },
};

module.exports.help = {
    name: "takipci-cikar",
    description: "Belirtilen kullanıcıyı takipçilerinizden çıkarır.",
    usage: "!takipci-cikar <@kullanıcıetiketi | instagram_kullanici_adi>",
};
