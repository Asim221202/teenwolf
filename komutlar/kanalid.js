const fs = require('fs');
let kanalVerisi = require('../data/kanalid.json');  // Veriyi alırken doğru yolu kontrol et

module.exports = {
    name: 'kanalekle',
    description: 'Bir kanal ekler.',
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

        // Kanal zaten eklenmiş mi kontrol et
        if (kanalVerisi.allowedChannels.includes(channel.id)) {
            return message.reply('Bu kanal zaten eklenmiş.');
        }

        // Kanalı ekle
        kanalVerisi.allowedChannels.push(channel.id);
        fs.writeFileSync('./data/kanalid.json', JSON.stringify(kanalVerisi, null, 2));

        message.reply(`Kanal başarıyla eklendi: ${channel}`);
    },
};