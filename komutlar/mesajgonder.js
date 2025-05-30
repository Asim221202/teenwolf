module.exports = {
  name: "mesajgönder",
  description: "Belirtilen mesaja başka bir kanala gönderir.",
  execute(message, args) {
    // Kullanıcı yönetici mi kontrol et
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply("Bu komutu kullanabilmek için yönetici olmanız gerekiyor!");
    }

    // Kullanıcıdan argümanları al
    const kanal = message.mentions.channels.first(); // İlk etiketlenen kanal
    const mesaj = args.slice(1).join(" "); // Mesaj içeriği (etiketten sonraki tüm argümanlar)

    // Eğer kanal veya mesaj eksikse hata döndür
    if (!kanal || !mesaj) {
      return message.reply("Lütfen bir kanal etiketleyin ve mesaj girin! Örnek: `.mesajgonder #kanal Merhaba!`");
    }

    // Mesajı hedef kanala gönder
    kanal
      .send(mesaj)
      .then(() => message.reply("Mesaj başarıyla gönderildi!"))
      .catch((err) => {
        console.error(err);
        message.reply("Mesaj gönderilirken bir hata oluştu.");
      });
  },
};