const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];
const commandsPath = path.join(__dirname, "komutlar");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    
    // Sadece `data` içerenleri (SlashCommandBuilder) yükle
    if (command.data && typeof command.data.toJSON === "function") {
        commands.push(command.data.toJSON());
        console.log(`✅ Slash komutu yüklendi: ${command.data.name}`);
    } else {
        console.warn(`⚠️  ${file} dosyasında 'data' eksik veya geçersiz, atlanıyor.`);
    }
}

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
    try {
        console.log("🚀 Slash komutları yükleniyor...");

        if (guildId) {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
            console.log("✅ Sunucu bazlı slash komutları başarıyla yüklendi.");
        } else {
            await rest.put(Routes.applicationCommands(clientId), { body: commands });
            console.log("✅ Global slash komutları başarıyla yüklendi.");
        }
    } catch (error) {
        console.error("❌ Komut yükleme sırasında hata oluştu:", error);
    }
})();