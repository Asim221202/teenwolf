const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'aktiflik',
  description: 'Kullanıcının son aktifliğini gösterir.',
  async execute(message, args) {
    const aktiflikYolu = path.join(__dirname, '../data/aktiflik.json');

    if (!fs.existsSync(aktiflikYolu)) {
      return message.reply('Aktiflik verisi bulunamadı.');
    }

    const aktiflikVerisi = JSON.parse(fs.readFileSync(aktiflikYolu, 'utf-8'));

    // Etiketlenmiş kullanıcı varsa ve bu kullanıcı sen değilsen kontrol et
    const hedefKullanıcı = message.mentions.users.first() || message.author;

    if (hedefKullanıcı.id !== message.author.id) {
      // Başkasına bakıyorsan ve YETKİLİ değilsen reddet
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.reply('Başka birinin aktifliğini sadece yetkililer görebilir.');
      }
    }

    const userId = hedefKullanıcı.id;
    const sonAktiflik = aktiflikVerisi[userId];

    if (!sonAktiflik) {
      return message.reply('Bu kullanıcının aktiflik verisi yok.');
    }

    const now = new Date();
    const aktiflikTarihi = new Date(sonAktiflik);
    const farkMs = now - aktiflikTarihi;

    const saniye = Math.floor(farkMs / 1000);
    const dakika = Math.floor(saniye / 60);
    const saat = Math.floor(dakika / 60);
    const gün = Math.floor(saat / 24);

    let neKadarÖnce = '';
    if (gün > 0) {
      neKadarÖnce = `${gün} gün önce`;
    } else if (saat > 0) {
      neKadarÖnce = `${saat} saat önce`;
    } else if (dakika > 0) {
      neKadarÖnce = `${dakika} dakika önce`;
    } else {
      neKadarÖnce = `az önce`;
    }

    const embed = new MessageEmbed()
      .setColor('#ffffff')
      .setAuthor(hedefKullanıcı.tag, hedefKullanıcı.displayAvatarURL({ dynamic: true }))
      .setTitle('Son Aktiflik Bilgisi')
      .setDescription(`${hedefKullanıcı} en son **${neKadarÖnce}** aktifti.`)
      .setFooter('Aktiflik Sistemi', message.client.user.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  }
};
