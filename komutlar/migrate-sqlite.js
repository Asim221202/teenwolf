const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('node:fs/promises');

// Veritabanı dosyasının yolunu belirtin (database.js'dekiyle aynı olmalı)
const dbPath = path.resolve(__dirname, 'data', 'database.sqlite');

// JSON dosyasının yolunu belirtin
const jsonPath = path.resolve(__dirname, 'data', 'kullanicilar.json');

async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error(`JSON dosyasını okurken hata (${filePath}):`, error);
    return {};
  }
}

async function insertKullanici(db, kullaniciId, kullaniciAdi, profilFoto) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO kullanicilar (kullaniciId, kullaniciAdi, profilFoto) VALUES (?, ?, ?)`,
      [kullaniciId, kullaniciAdi, profilFoto || null],
      function (err) {
        if (err) {
          console.error('Kullanıcı eklenirken hata:', err.message);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function insertBio(db, kullaniciId, bio) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO bio (kullaniciId, bio) VALUES (?, ?)`,
      [kullaniciId, bio],
      function (err) {
        if (err) {
          console.error('Biyo eklenirken hata:', err.message);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function migrateData(db, jsonData) {
  console.log('Veri migrasyonu başlatılıyor...');

  for (const kullaniciId in jsonData) {
    if (jsonData.hasOwnProperty(kullaniciId)) {
      const kullanici = jsonData[kullaniciId];
      await insertKullanici(db, kullaniciId, kullanici.kullaniciAdi, kullanici.profilFoto);
      if (kullanici.bio) {
        await insertBio(db, kullaniciId, kullanici.bio);
      }
    }
  }

  console.log('Kullanıcılar ve biyografiler aktarıldı.');
}

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('SQLite veritabanına bağlanırken hata:', err.message);
    return;
  }
  console.log('SQLite veritabanına başarıyla bağlandı (migrasyon için)!');

  try {
    const jsonData = await readJSON(jsonPath);
    await migrateData(db, jsonData);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('SQLite bağlantısı kapatılırken hata:', err.message);
      } else {
        console.log('SQLite bağlantısı kapatıldı (migrasyon tamamlandı).');
      }
    });
  }
});
