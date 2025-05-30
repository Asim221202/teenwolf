const db = require('../database');

module.exports = {
    name: 'pp-ekle',
    description: 'Profilinize bir profil fotoğrafı ekler veya değiştirir (URL veya yüklenen dosya).',
    usage: '.pp-ekle <URL> veya bir fotoğraf dosyası gönderin',
    async execute(message, args) {
        const kullaniciId = message.author.id;
        let profilFotoUrl;

        // Eğer mesajda bir URL varsa onu kullan
        if (args.length > 0) {
            profilFotoUrl = args[0];
        }

        // Eğer mesajda bir dosya eki varsa onun URL'sini kullan
        if (message.attachments.size > 0) {
            profilFotoUrl = message.attachments.first().url;
        }

        if (!profilFotoUrl) {
            return message.reply('Lütfen bir profil fotoğrafı URL\'si belirtin veya bir fotoğraf dosyası gönderin.');
        }

        try {
            db.get(`SELECT * FROM kullanicilar WHERE kullaniciId = ?`, [kullaniciId], (err, kullanici) => {
                if (err) {
                    console.error('Kullanıcı kontrol edilirken hata:', err.message);
                    return message.reply('Profil fotoğrafı güncellenirken bir hata oluştu.');
                }
                if (!kullanici) {
                    return message.reply('Önce bir hesap oluşturmalısınız.');
                }

                db.run(`UPDATE kullanicilar SET profilFoto = ? WHERE kullaniciId = ?`, [profilFotoUrl, kullaniciId], function(err) {
                    if (err) {
                        console.error('Profil fotoğrafı güncellenirken hata:', err.message);
                        return message.reply('Profil fotoğrafı güncellenirken bir hata oluştu.');
                    }
                    message.reply('Profil fotoğrafınız başarıyla güncellendi!');
                    console.log(`[pp-ekle] ${message.author.tag} adlı kullanıcının profil fotoğrafı güncellendi: ${profilFotoUrl}`);
                });
            });
        } catch (error) {
            console.error('[pp-ekle] Profil fotoğrafı güncellenirken hata:', error);
            message.reply('Profil fotoğrafı güncellenirken bir hata oluştu.');
        }
    },
};
