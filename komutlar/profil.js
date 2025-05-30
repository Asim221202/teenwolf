const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { userId, fark } = require('../data/enUzunEmote.json');
const enUzunEmoteData = require('../data/enUzunEmote.json')
module.exports = {
  name: 'profil',
  description: 'Belirtilen kullanıcıya ait profil bilgilerini gösterir.',
  async execute(message, args) {
    const profilYolu = path.join(__dirname, '../data/profils.json');
    const aktiflikYolu = path.join(__dirname, '../data/aktiflik.json');

    // Kullanıcıyı etiketleyin
    const etiketlenen = message.mentions.users.first() || message.author;
    
    // Profil verisini al
    let profiles = {};
    if (fs.existsSync(profilYolu)) {
      profiles = JSON.parse(fs.readFileSync(profilYolu, 'utf-8'));
    }

    const profil = profiles[etiketlenen.id];
    if (!profil) {
      return message.reply('Bu kullanıcı için profil bulunamadı.');
    }
    const aktiflikVerisi = JSON.parse(fs.readFileSync(aktiflikYolu, 'utf-8'));
    const userId = etiketlenen.id;
const enUzunEmoteBilgisi = enUzunEmoteData[userId];
        const enUzunEmoteGoster = enUzunEmoteBilgisi ? enUzunEmoteBilgisi.fark : "Henüz kaydedilmedi";
    
const sonAktiflik = aktiflikVerisi[userId];

let neKadarÖnce = 'Veri yok';
if (sonAktiflik) {
  const now = new Date();
  const aktiflikTarihi = new Date(sonAktiflik);
  const farkMs = now - aktiflikTarihi;

  const saniye = Math.floor(farkMs / 1000);
  const dakika = Math.floor(saniye / 60);
  const saat = Math.floor(dakika / 60);
  const gün = Math.floor(saat / 24);

  if (gün > 0) {
    neKadarÖnce = `${gün} gün önce`;
  } else if (saat > 0) {
    neKadarÖnce = `${saat} saat önce`;
  } else if (dakika > 0) {
    neKadarÖnce = `${dakika} dakika önce`;
  } else {
    neKadarÖnce = `az önce`;
  }
}
    const balancesPath = path.join(__dirname, '../data/balances.json');
let balancesData = {};

if (fs.existsSync(balancesPath)) {
  balancesData = JSON.parse(fs.readFileSync(balancesPath, 'utf-8'));
}

const kullaniciVerisi = balancesData[etiketlenen.id];
let maddiDurum = 'Veri yok';

if (kullaniciVerisi) {
  const totalPara = kullaniciVerisi.balance + kullaniciVerisi.bank;

  if (totalPara < 5000) {
    maddiDurum = 'Çok Kötü';
  } else if (totalPara < 10000) {
    maddiDurum = 'Kötü';
  } else if (totalPara < 50000) {
    maddiDurum = 'Orta';
  } else if (totalPara < 200000) {
    maddiDurum = 'İyi';
  } else if (totalPara < 500000) {
    maddiDurum = 'Zengin';
  } else {
    maddiDurum = 'Aşırı Zengin';
  }
}
    const kelimeVerisiYolu = path.join(__dirname, '../data/kelimeVerisi.json')
let kelimeVerisi = {};
if (fs.existsSync(kelimeVerisiYolu)) {
  kelimeVerisi = JSON.parse(fs.readFileSync(kelimeVerisiYolu, 'utf-8'));
}

const kelimeSayisi = kelimeVerisi[userId] ? kelimeVerisi[userId].kelimeSayisi : 0;

    // Durumu belirleme
    let durum = '';
    if (kelimeSayisi <= 5000) {
      durum = 'Yeni Başlayan';
    } else if (kelimeSayisi <= 10000) {
      durum = 'Çaylak';
    } else if (kelimeSayisi <= 50000) {
      durum = 'Tecrübeli';
    } 
    // Embed oluştur
    const embe = new MessageEmbed()
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setFooter({ text: '༒ | Profil Sistemi', iconURL: `${message.author.avatarURL({ dynamic: true })}` })
     .setThumbnail(etiketlenen.displayAvatarURL({ dynamic: true })) // Sağdaki küçük profil fotoğrafı
      .setImage(profil.fotoğraf) // Ana profil fotoğrafı
      .setDescription(`***${etiketlenen.username} adlı kullanıcının profili:***\n\n**Ad & Soyad:** ${profil.isim}\n**Yaş:** ${profil.yaş}\n**Tür:** ${profil.tür}\n**Son Aktiflik(RolePlay):** ${neKadarÖnce}\n**Maddi Durum:** ${maddiDurum}\n**RolePlay Durumu:** ${durum}\n**En Uzun Emote:** ${enUzunEmoteGoster}`)
    
    message.channel.send({ embeds: [embe] });
  }
};