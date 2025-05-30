const mongoose = require('mongoose');
const { Kullanici, Bio } = require('../models/allSchemas'); // Sadece Kullanici ve Bio modellerini import edin
const fs = require('node:fs/promises');
const path = require('node:path');

// MongoDB bağlantı URI'nizi buraya girin
const MONGODB_URI = 'mongodb+srv://sscrxpie:Asim2212@theotherside.ork4yeb.mongodb.net/?retryWrites=true&w=majority&appName=theotherside';

// kullanicilar.json dosyasının yolunu buraya girin
const kullanicilarPath = path.join(__dirname, '../data/kullanicilar.json');

async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error(`Dosya okuma hatası (${filePath}):`, error);
    return {};
  }
}

async function migrateKullanicilar() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB\'ye bağlandı!');

    const kullanicilarData = await readJSON(kullanicilarPath);
    const kullaniciPromises = Object.keys(kullanicilarData).map(async kullaniciId => {
      const kullanici = kullanicilarData[kullaniciId];
      return Kullanici.findOneAndUpdate(
        { kullaniciId: kullaniciId },
        { kullaniciId: kullaniciId, kullaniciAdi: kullanici.kullaniciAdi, profilFoto: kullanici.profilFoto },
        { upsert: true }
      );
    });
    await Promise.all(kullaniciPromises);
    console.log('Kullanıcılar aktarıldı!');

    // Eğer bio bilgisi de kullanicilar.json içinde gömülüyse burayı düzenleyin
    const bioPromises = Object.keys(kullanicilarData).map(async kullaniciId => {
      const kullanici = kullanicilarData[kullaniciId];
      if (kullanici.bio) { // Eğer bio alanı varsa
        return Bio.findOneAndUpdate(
          { kullaniciId: kullaniciId },
          { kullaniciId: kullaniciId, bio: kullanici.bio },
          { upsert: true }
        );
      }
      return Promise.resolve(); // Bio yoksa bir şey yapma
    });
    await Promise.all(bioPromises);
    console.log('Biyografiler aktarıldı!');

    console.log('kullanicilar.json verileri MongoDB\'ye başarıyla aktarıldı!');
  } catch (error) {
    console.error('Veri aktarımı sırasında bir hata oluştu:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı.');
  }
}

migrateKullanicilar();
