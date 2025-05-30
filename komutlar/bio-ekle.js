const db = require('../database');

module.exports = {
    name: 'bio-ekle',
    description: 'Profilinize bir biyografi ekler veya mevcut biyografinizi değiştirir.',
    usage: '.bio-ekle <biyografi metni>',
    async execute(message, args) {
        const kullaniciId = message.author.id;
        const bio = args.join(' ').trim();

        if (!bio) {
            return message.reply('Lütfen eklemek istediğiniz biyografi metnini belirtin.');
        }

        db.run(`
            INSERT INTO bio (kullaniciId, bio) VALUES (?, ?)
            ON CONFLICT(kullaniciId) DO UPDATE SET bio = ?
        `, [kullaniciId, bio, bio], function(err) {
            if (err) {
                console.error('[bio-ekle] Biyografi kaydedilirken hata:', err.message);
                return message.reply('Biyografi eklenirken bir hata oluştu.');
            }
            message.reply('Biyografiniz başarıyla eklendi veya değiştirildi!');
            console.log(`[bio-ekle] ${message.author.tag} adlı kullanıcının biyografisi güncellendi: ${bio}`);
        });
    },
};
