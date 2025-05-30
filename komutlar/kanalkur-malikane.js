const { Permissions } = require('discord.js');

module.exports = {
    name: 'kanalkur-malikane',
    description: 'Belirtilen türde dublex kanal oluşturur.',
    async execute(message, args) {
        // Sunucuda olup olmadığını kontrol et
        if (!message.guild) {
            return message.reply("Bu komut yalnızca sunucularda çalışabilir.");
        }

        // Sunucu ID'sini kontrol et
        const allowedGuildId = '1327541284646293504';  // Verdiğiniz Guild ID
        if (message.guild.id !== allowedGuildId) {
            return message.reply("Bu komut yalnızca belirli bir sunucuda çalışabilir.");
        }

        // Kullanıcıda kanal oluşturma izni var mı kontrol et
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.reply("Kanalları yönetme izniniz yok.");
        }

        // Komutla gelen ev sahibi ismini al
        const evIsmi = args.join(" ");
        if (!evIsmi) {
            return message.reply("Lütfen geçerli bir ev ismi girin.");
        }

        // Kategori ID'sini burada girin
        const kategoriId = '1346125340564656190';  // Verdiğiniz Kategori ID
        const kategori = message.guild.channels.cache.get(kategoriId);
        if (!kategori) {
            return message.reply("Belirtilen kategori bulunamadı.");
        }

        try {
            // Dublex ana kanalı oluştur
            const kanalAdi = `『🏯』${evIsmi.replace(/\s+/g, '-').toLowerCase()}-malikanesi`;  // Kanal adını düzenle
            const kanal = await message.guild.channels.create(kanalAdi, {
                type: 'GUILD_TEXT',
                parent: kategori.id,
            });

            // Alt başlıklar için thread'ler oluştur
            const altBasliklar = [
                "Yatak Odası",
                "Yatak Odası",
                "Yatak Odası",
                "Misafir Odası",
                "Balkon",
              
                "Koridor",
                "Mutfak",
                "Salon",
                "Giriş",
                "Ön Bahçe"
                 ];

            // Thread başlıklarını oluştur
            for (const baslik of altBasliklar) {
                // Her başlık için yeni bir thread oluştur
                const thread = await kanal.threads.create({
                    name: `${baslik}`,  // Başlık ve kanal adını ekle
                    autoArchiveDuration: 60, // Thread otomatik kapanma süresi (dakika)
                    reason: `Alt başlık: ${baslik}`,
                });

                // Thread içine kanal adıyla başlık olarak metin gönder
                await thread.send(`**${baslik}**`);
            }

            message.reply(`Dublex ev ve alt başlıklar başarıyla oluşturuldu: **${evIsmi}**`);
        } catch (error) {
            console.error(error);
            message.reply("Bir hata oluştu, lütfen tekrar deneyin.");
        }
    }
};