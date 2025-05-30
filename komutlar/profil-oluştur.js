const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'profil-oluştur',
  description: 'Belirtilen kullanıcı için roleplay profili oluşturur.',
  async execute(message, args) {
    const profilYolu = path.join(__dirname, '../data/profils.json');

    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      return message.reply('Bu komutu sadece yetkililer kullanabilir.');
    }

    const etiketlenen = message.mentions.users.first();
    if (!etiketlenen) return message.reply('Lütfen bir kullanıcı etiketleyin.');

    const attachment = message.attachments.first();
    if (!attachment || !attachment.contentType.startsWith('image/')) {
      return message.reply('Lütfen bir fotoğraf ekleyin.');
    }

    // args'tan mention'ı çıkar
    const argumanlar = args.slice(1);
    const yasIndex = argumanlar.findIndex(a => /^\d+$/.test(a));

    if (yasIndex === -1 || yasIndex === 0 || yasIndex === argumanlar.length - 1) {
      return message.reply('Lütfen isim, yaş ve türü doğru şekilde girin. Örn: `.profil-oluştur @kullanıcı Stefan Salvatore 171 Vampir`');
    }

    const isim = argumanlar.slice(0, yasIndex).join(' ');
    const yaş = argumanlar[yasIndex];
    const tür = argumanlar.slice(yasIndex + 1).join(' ');

    let profiles = {};
    if (fs.existsSync(profilYolu)) {
      profiles = JSON.parse(fs.readFileSync(profilYolu, 'utf-8'));
    }

    profiles[etiketlenen.id] = {
      isim,
      yaş,
      tür,
      fotoğraf: attachment.url
    };

    fs.writeFileSync(profilYolu, JSON.stringify(profiles, null, 2));

    message.reply(`✅ ${etiketlenen.username} için profil oluşturuldu!`);
  }
};