// komutlar/seviyeKomutu.js
const { MessageEmbed } = require('discord.js');
const { viewLevel } = require('./seviye');  // seviye.js dosyasındaki viewLevel fonksiyonunu çağır

module.exports = {
    name: 'seviye',
    description: 'Kullanıcının seviyesini gösterir.',
    execute(message, args) {
      // Kullanıcıda belirli bir rol olup olmadığını kontrol etmek için fonksiyon
        function checkUserRole(roleName) {
            return message.member.roles.cache.some(role => role.name === roleName);
        }

        // İstediğiniz rol adı (örneğin 'Admin' rolü)
        const roleName = 'RolePlay Üye';

        // Kullanıcının belirli bir rolü olup olmadığını kontrol et
        if (!checkUserRole(roleName)) {
            return message.reply('Bu komutu kullanmak için RolePlaye katılın.');
        }

        // Komutun geri kalan işlevselliği burada yer alacak
        // Örnek olarak bir mesaj gönderelim

    
        const userId = message.author.id;  // Mesajı atan kullanıcının ID'si
        
        // Kullanıcı seviyesini al
        const userLevelData = viewLevel(userId);

        // Embed mesajı oluştur
        const userEmbed = new MessageEmbed()
            .setTitle(`${message.author.username}'ın Seviyesi`)
            .setDescription(`Seviye: **${userLevelData.level}**\nKelime Sayısı: **${userLevelData.words}**`)
            .setColor('BLUE')
            .setFooter('Kelime Sistemi');

        // Mesajı gönder
        message.channel.send({ embeds: [userEmbed] });
    },
};