const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        // Hoş geldin mesajı kanalı
        const welcomeChannel = member.guild.channels.cache.get('1327584741133783050'); // Hoş geldin kanalı ID'sini buraya girin
        if (!welcomeChannel) return console.error('Hoş geldin kanalı bulunamadı!');

        // Log mesajı kanalı
        const logChannel = member.guild.channels.cache.get('1327543010065645582'); // Log kanalı ID'sini buraya girin
        if (!logChannel) return console.error('Log kanalı bulunamadı!');

        // Kayıtsız rolü ID'si
        const kayitsizRolID = '1327613823531749436'; // Kayıtsız rol ID'sini buraya girin
const roleID = '1328077529667342416'
        // Rol ekleme işlemi
        const kayitsizRol = member.guild.roles.cache.get(kayitsizRolID);
        if (!kayitsizRol) {
            console.error('Kayıtsız rolü bulunamadı!');
        } else {
            member.roles.add(kayitsizRol)
                .then(() => console.log(`${member.user.tag} kullanıcısına Kayıtsız rolü verildi.`))
                .catch((err) => console.error(`Kayıtsız rolü atanırken hata oluştu: ${err}`));
        }

        // Hoş geldin Embed
        const welcomeEmbed = new MessageEmbed()
            .setColor('#FFFFFF') // Renk
            .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
            .setTitle('𝐓𝐡𝐞 𝐎𝐭𝐡𝐞𝐫 𝐒𝐢𝐝𝐞 𝐒𝐮𝐧𝐮𝐜𝐮𝐬𝐮𝐧𝐚 𝐇𝐨𝐬̧ 𝐆𝐞𝐥𝐝𝐢𝐧!')
            .setDescription (
                `𝐅𝐎𝐑 𝐓𝐑 🇹🇷  
                > **Hoş Geldin! Roleplay Sunucumuzda Kayıt İşleminizin Tamamlanması İçin İsim Ve Yaşınızı Söyler misiniz?**  

𝐅𝐎𝐑 𝐄𝐍𝐆 🌐  
                > **Welcome! Please Tell Us Your Name And Age to Complete Your Registration on Our Roleplay Server.**`
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 })) // Sağ üst köşede kullanıcı avatarı
            .setImage('https://i.imgur.com/zakdfkG.gif') // Hoş geldin GIF'i
            .setFooter({ text: 'Keyifli vakitler!', iconURL: member.user.displayAvatarURL({ dynamic: true }) });

        // Hoş geldin mesajını gönder
        welcomeChannel.send({content: `> <@&${roleID}>,${member} **Sunucuya Katıldı!**`,embeds: [welcomeEmbed] });

        // Log mesajı
      const logEmbed = new MessageEmbed()
            .setColor('#FFFFFF') // Renk
            .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`𝐓𝐡𝐞 𝐎𝐭𝐡𝐞𝐫 𝐒𝐢𝐝𝐞 𝐒𝐮𝐧𝐮𝐜𝐮𝐬𝐮𝐧𝐚 𝐊𝐚𝐭ı𝐥𝐝ı.`)
            .setDescription('𝐴𝑟𝑎𝑚𝑖𝑧𝑎 𝐾𝑎𝑡𝑖𝑙𝑑𝑖𝑔̆𝑖𝑛 𝐼̇𝑐̧𝑖𝑛 𝑀𝑢𝑡𝑙𝑢𝑦𝑢𝑧.')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 })) // Sağ üst köşede kullanıcı avatarı
            .setImage('https://cdn.discordapp.com/attachments/1210677407015510066/1216339461533732965/IMG_1649.gif') // Hoş geldin GIF'i
            .setFooter({ text: 'Keyifli vakitler!', iconURL: member.user.displayAvatarURL({ dynamic: true }) });

        logChannel.send({content: `> ${member} **Sunucuya Katıldı!**`,embeds: [logEmbed] });
    },
};