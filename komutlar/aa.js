const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'aa',
    description: 'Deneme için embed mesajı yanıt olarak gönderir.',
    execute(message, args) {
        // Embed mesajı
              const welcomeEmbed = new MessageEmbed()
            .setColor("#ffffff") // Kan kırmızısı
            .setTitle("➝ 𝗝𝗢𝗜𝗡.𝗚𝗚/𝗧𝗛𝗘𝗢𝗧𝗛𝗘𝗥𝗦𝗜𝗗𝗘")
            .setDescription(`
            **𝐓𝐄𝐒̧𝐄𝐊𝐊𝐔̈𝐑𝐋𝐄𝐑, 𝐁𝐎𝐎𝐒𝐓𝐄𝐑!**  <@${message.author.id}>  
   *The Other Side'a takviye yaptığın için teşekkür ederiz! Özel ayrıcalıklar ve ödüller kazandın!*
    **🎁 𝐀𝐘𝐑𝐈𝐂𝐀𝐋𝐈𝐊 𝐁𝐈𝐋𝐆𝐈𝐋𝐄𝐑𝐈:**  
          - <#1329567625809887383>  
            `)
            .setImage("https://i.imgur.com/j5Tl3uk.gif") // Boost görseli ekleyebilirsin.
            .setFooter(`Şu anki boost sayısı: X `);

        
            // Komutu yazan kişiye yanıt olarak embed gönder
        message.reply({content: `<@${message.author.id}>` , embeds: [welcomeEmbed] });
    },
};