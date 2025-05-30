const fs = require('fs');
let kanalVerisi = require('../data/kanalid.json');  // Kanal verilerini al

module.exports = {
    name: 'kanalsil',
    description: 'Bir kanalı listeden siler.',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanabilmek için yönetici iznine sahip olmalısınız.');
        }

        const channel = message.mentions.channels.first();  // Kullanıcıdan kanal al

        if (!channel) {
            return message.reply('Lütfen bir kanal belirtin.');
        }

        // allowedChannels dizisini kontrol et
        if (!Array.isArray(kanalVerisi.allowedChannels)) {
            return message.reply('Kanal listesi hatalı. Lütfen yöneticinize başvurun.');
        }

        // Kanal zaten listede var mı kontrol et
        const index = kanalVerisi.allowedChannels.indexOf(channel.id);
        if (index === -1) {
            return message.reply('Bu kanal listede bulunmamaktadır.');
        }

        // Kanalı listeden sil
        kanalVerisi.allowedChannels.splice(index, 1);
        fs.writeFileSync('./data/kanalid.json', JSON.stringify(kanalVerisi, null, 2));

        message.reply(`Kanal başarıyla listeden silindi: ${channel}`);
    },
};