const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "bakiye",
    description: "Kullanıcının cüzdan ve banka bakiyesini gösterir. Yetkililer başkalarının bakiyesini görebilir.",
    execute(message, args) {
        function checkUserRole(roleName) {
            return message.member.roles.cache.some(role => role.name === roleName);
        }

        // İstediğiniz rol adı (örneğin 'RolePlay Üye' rolü)
        const roleName = 'RolePlay Üye';

        // Kullanıcının belirli bir rolü olup olmadığını kontrol et
        if (!checkUserRole(roleName)) {
            return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
        }

        const userId = message.author.id;
        const balancesFilePath = path.join(__dirname, '../data/balances.json');
        const targetUser = message.mentions.users.first();
        const isAdmin = message.member.permissions.has("ADMINISTRATOR");

        // Eğer veritabanı dosyası yoksa, dosya oluştur
        if (!fs.existsSync(balancesFilePath)) {
            fs.writeFileSync(balancesFilePath, JSON.stringify({}, null, 2));
        }

        // JSON dosyasını oku
        const data = JSON.parse(fs.readFileSync(balancesFilePath, 'utf8'));

        // Hedef kullanıcı belirle
        let targetId = userId; // Varsayılan: Kendi bakiyesi
        if (targetUser) {
            if (!isAdmin) {
                return message.reply("Başkasının bakiyesini görmek için yetkiniz yok.");
            }
            targetId = targetUser.id;
        }

        // Kullanıcı verilerini kontrol et
        if (!data[targetId]) {
            data[targetId] = { balance: 0, bank: 0 };
        }

        // Banka bakiyesi ekle
        if (!data[targetId].bank) {
            data[targetId].bank = 0; // Eğer banka bakiyesi yoksa 0 olarak ayarla
        }

        // Güncellenen veriyi tekrar dosyaya kaydet
        fs.writeFileSync(balancesFilePath, JSON.stringify(data, null, 2));

        const { balance, bank } = data[targetId];
        const username = targetUser ? targetUser.username : message.author.username;

        // Embed oluştur
        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle('༒ The Other Side')
            .setDescription(`**${username}** kullanıcısının bakiye bilgileri:`)
            .addField('Cüzdan Bakiyesi:', `${balance} $`, true)
            .addField('Banka Bakiyesi:', `${bank} $`, true)
            .setFooter({ text: '༒ | Ekonomi Sistemi' })
            .setTimestamp()
            .setThumbnail((targetUser || message.author).displayAvatarURL({ dynamic: true }))
            .setImage('https://media1.tenor.com/images/8c15cf2457f96b0b59e9e41b4d40c229/tenor.gif');

        return message.reply({ embeds: [embed] });
    }
};
