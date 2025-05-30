const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "uyarı",
    description: "Belirtilen kullanıcıya uyarı verir.",
    usage: "<@kullanıcı> [sebep]",
    permissions: ["MANAGE_MESSAGES"],
    execute(message, args) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("Bu komutu kullanmak için gerekli göte sahip değilsiniz!");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("Lütfen bir kullanıcı etiketleyin!");

        const reason = args.slice(1).join(" ") || "Belirtilmedi";
        const warn1Role = message.guild.roles.cache.find(r => r.name === "Uyarı-1");
        const warn2Role = message.guild.roles.cache.find(r => r.name === "Uyarı-2");
        const warn3Role = message.guild.roles.cache.find(r => r.name === "Uyarı-3");
         
        const logChannelId = "1331625066642931722"; // Log kanalının ID'si
        const logChannel = message.guild.channels.cache.get(logChannelId);

        if (!warn1Role || !warn2Role) return message.reply("`Uyarı-1` veya `Uyarı-2` rolü bulunamadı!");
        if (!logChannel) return message.reply("Belirtilen kanal ID'si geçersiz!");

       let warnCount = 0;

if (member.roles.cache.has(warn1Role.id)) warnCount = 1;
if (member.roles.cache.has(warn2Role.id)) warnCount = 2;
if (member.roles.cache.has(warn3Role.id)) warnCount = 3;

if (warnCount === 0) {
    member.roles.add(warn1Role).catch(console.error);
    message.channel.send(`${member} uyarıldı! (1. uyarı)`);
} else if (warnCount === 1) {
    member.roles.remove(warn1Role).catch(console.error); // önceki uyarı rolünü kaldır
    member.roles.add(warn2Role).catch(console.error);
    message.channel.send(`${member} ikinci kez uyarıldı! (2. uyarı)`);
} else if (warnCount === 2) {
    member.roles.remove(warn2Role).catch(console.error); // önceki uyarı rolünü kaldır
    member.roles.add(warn3Role).catch(console.error);
    message.channel.send(`${member} üçüncü kez uyarıldı! (3. uyarı)`);
} else {
    message.channel.send(`${member} zaten üç kez uyarılmış! Daha fazla işlem gerekebilir.`);
}

        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("⚠ Kullanıcı Uyarıldı")
            .addField("Kullanıcı", `${member}`, true)
            .addField("Yetkili", `${message.author}`, true)
            .addField("Sebep", reason)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};