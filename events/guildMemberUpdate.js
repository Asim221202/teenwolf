const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guildMemberUpdate',
    execute(oldMember, newMember) {
        // Eğer eski durumda premium yoksa ve yeni durumda varsa, boost atılmış demektir.
        if (!oldMember.premiumSince && newMember.premiumSince) {
            // 3 saniye gecikme ekleyerek boost işleminin gerçekten tamamlanmasını bekleyelim
            setTimeout(() => {
                const boosterRoleID = "1327637020767555626"; // Booster rolü ID'si
                const boosterChannelID = "1327984835603468319"; // Boost teşekkür mesajının gideceği kanal ID'si
                const channel = newMember.guild.channels.cache.get(boosterChannelID);
                
                if (!channel) return;

                const embed = new MessageEmbed()
                    .setColor("#8B0000") // Kan kırmızısı
                    .setTitle("➝ 𝗝𝗢𝗜𝗡.𝗚𝗚/𝗧𝗛𝗘𝗢𝗧𝗛𝗘𝗥𝗦𝗜𝗗𝗘")
                    .setDescription(`
                        **𝐓𝐄𝐒̧𝐄𝐊𝐊𝐔̈𝐑𝐋𝐄𝐑, 𝐁𝐎𝐎𝐒𝐓𝐄𝐑!** <@${newMember.id}>  
                        *The Other Side'a takviye yaptığın için teşekkür ederiz!  
                        Özel ayrıcalıklar ve ödüller kazandın!*  
                        ** 𝐀𝐘𝐑𝐈𝐂𝐀𝐋𝐈𝐊 𝐁𝐈𝐋𝐆𝐈𝐋𝐄𝐑𝐈:**  
                        - <#1329567625809887383>  
                    `)
                    .setImage("https://i.imgur.com/j5Tl3uk.gif")
                    .setFooter(`Şu anki boost sayısı: ${newMember.guild.premiumSubscriptionCount}`);

                channel.send({ content: `<@${newMember.id}>`, embeds: [embed] });
            }, 3000); // 3 saniye gecikme ekledik
        }
    }
};