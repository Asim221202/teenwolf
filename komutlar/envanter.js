const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'envanter',
    description: 'Kullanıcının sahip olduğu ürünleri gösterir.',
    execute(message) {
        // Kullanıcı bilgilerini JSON dosyasından oku
        const filePath = path.join(__dirname, '../data/envanter.json');
        let usersData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Kullanıcıda belirli bir rol olup olmadığını kontrol etmek için fonksiyon
        function checkUserRole(roleName) {
            return message.member.roles.cache.some(role => role.name === roleName);
        }

        // İstediğiniz rol adı (örneğin 'Admin' rolü)
        const roleName = 'RolePlay Üye';

        // Komutun hangi kullanıcılar tarafından kullanılabileceğini kontrol et
        const isAdmin = checkUserRole('Kurucu');  // Admin rolü kontrolü
        const isRolePlayUser = checkUserRole(roleName); // RolePlay Üye rolü kontrolü

        // Kullanıcı kendi envanterini görmek istiyorsa
        if (!message.mentions.users.size) {
            if (!isRolePlayUser) {
                return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
            }

            // Kullanıcı verisini almak
            const userId = message.author.id;
            if (!usersData[userId] || !usersData[userId].inventory || usersData[userId].inventory.length === 0) {
                return message.reply("Henüz hiçbir ürününüz yok.");
            }

            // Kullanıcının envanteri
            const inventory = usersData[userId].inventory.map(item => `\`${item}\``).join('\n');

            // Envanter mesajı
            const embed = new MessageEmbed()
                .setTitle(`${message.author.username} Envanteri`)
                .setDescription(inventory)
                .setColor("BLUE");

            return message.channel.send({ embeds: [embed] });
        }

        // Eğer bir kullanıcıyı etiketlediyse, admin yetkisine sahip olup olmadığını kontrol et
        if (message.mentions.users.size === 1 && isAdmin) {
            const mentionedUser = message.mentions.users.first();
            const mentionedUserId = mentionedUser.id;

            // Etiketlenen kullanıcının envanterini kontrol et
            if (!usersData[mentionedUserId] || !usersData[mentionedUserId].inventory || usersData[mentionedUserId].inventory.length === 0) {
                return message.reply(`${mentionedUser.username} adlı kullanıcının henüz hiçbir ürünü yok.`);
            }

            // Etiketlenen kullanıcının envanteri
            const inventory = usersData[mentionedUserId].inventory.map(item => `\`${item}\``).join('\n');

            // Envanter mesajı
            const embed = new MessageEmbed()
                .setTitle(`${mentionedUser.username} Envanteri`)
                .setDescription(inventory)
                .setColor("BLUE");

            return message.channel.send({ embeds: [embed] });
        }

        // Kullanıcıya bir uyarı mesajı gönderelim
        return message.reply('Başka bir kullanıcının envanterini görmek için yetkili olmanız gerekmektedir.');
    }
};