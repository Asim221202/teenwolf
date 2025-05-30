const fs = require('fs');
const path = require('path');

module.exports = {
  name: "özelkomut-ekle",
  description: "Yeni bir özel komut ekler.",
  execute(message, args) {
    const filePath = path.join(__dirname,'/data/customCommands.json');

    // Eğer dosya yoksa oluştur
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }

    // Komut ve yanıt argümanlarını ayır
    const [trigger, response] = args.join(' ').split('-').map(item => item.trim());

    if (!trigger || !response) {
      return message.reply("Lütfen komutu şu şekilde girin: `.özelkomut-ekle \"Komut\"-\"Yanıt\"`");
    }

    // Dosyayı oku ve güncelle
    const customCommands = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    customCommands[trigger] = response;

    fs.writeFileSync(filePath, JSON.stringify(customCommands, null, 2));

    message.reply(`Özel komut başarıyla eklendi: "${trigger}" → "${response}"`);
  },
};