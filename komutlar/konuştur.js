module.exports = {
    name: 'konuştur',
    description: 'Botun belirttiğiniz mesajı yazmasını sağlar.',
    execute(message, args) {
      if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply("Bu komutu kullanmak için yeterli yetkiniz yok.");
    }
        // Kullanıcının yazdığı metni al
        const metin = args.join(' ');

        // Eğer metin boşsa hata mesajı döndür
        if (!metin) {
            return message.reply('Lütfen bir mesaj yazın! Örnek kullanım: `.konuştur selam`');
        }

        // Botun mesajı göndermesi
        message.channel.send(metin);
    },
};