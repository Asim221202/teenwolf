const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Veritabanı dosyasının yolunu belirtin
const dbPath = path.resolve(__dirname, 'data', 'database.sqlite');

// Veritabanına bağlanın
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite veritabanına bağlanırken hata:', err.message);
  } else {
    console.log('SQLite veritabanına başarıyla bağlandı!');
    // Tabloları oluşturmak için burayı kullanabilirsiniz (isteğe bağlı)
    db.run(`
      CREATE TABLE IF NOT EXISTS kullanicilar (
        kullaniciId TEXT PRIMARY KEY,
        kullaniciAdi TEXT NOT NULL UNIQUE,
        profilFoto TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS bio (
        kullaniciId TEXT PRIMARY KEY,
        bio TEXT,
        FOREIGN KEY (kullaniciId) REFERENCES kullanicilar(kullaniciId)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS takip (
        takipEdenId TEXT NOT NULL,
        takipEdilenId TEXT NOT NULL,
        PRIMARY KEY (takipEdenId, takipEdilenId),
        FOREIGN KEY (takipEdenId) REFERENCES kullanicilar(kullaniciId),
        FOREIGN KEY (takipEdilenId) REFERENCES kullanicilar(kullaniciId)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS gonderiler (
        gonderiId INTEGER PRIMARY KEY AUTOINCREMENT,
        yazarId TEXT NOT NULL,
        icerik TEXT NOT NULL,
        medyaUrl TEXT,
        begeniSayisi INTEGER DEFAULT 0,
        olusturmaTarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (yazarId) REFERENCES kullanicilar(kullaniciId)
      )
    `);
  }
});

// Veritabanı nesnesini dışa aktarın
module.exports = db;
