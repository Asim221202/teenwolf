const fs = require('fs');
const path = require('path');

const kelimeVerisiYolu = path.join(__dirname, '../data/kelimeVerisi.json');
const aktiflikYolu = path.join(__dirname, '../data/aktiflik.json');

// Dosyalar kontrol ediliyor
if (!fs.existsSync(kelimeVerisiYolu)) {
  console.error('\x1b[31m%s\x1b[0m', 'kelimeVerisi.json bulunamadı!');
  process.exit(1); // Programı hata koduyla durdur
}
if (!fs.existsSync(aktiflikYolu)) {
  fs.writeFileSync(aktiflikYolu, '{}'); // aktiflik dosyası varsa oluştur
}

let öncekiVeri = JSON.parse(fs.readFileSync(kelimeVerisiYolu, 'utf-8'));

// Dosyayı izlemeye başla
fs.watchFile(kelimeVerisiYolu, { interval: 1000 }, () => {
  try {
    const yeniVeri = JSON.parse(fs.readFileSync(kelimeVerisiYolu, 'utf-8'));
    const aktiflikVerisi = JSON.parse(fs.readFileSync(aktiflikYolu, 'utf-8'));
    const suankiTarih = new Date().toISOString();

    for (const userId in yeniVeri) {
      const eski = öncekiVeri[userId]?.words || 0;
      const yeni = yeniVeri[userId]?.words || 0;

      if (eski !== yeni) {
        aktiflikVerisi[userId] = suankiTarih;
      }
    }

    öncekiVeri = yeniVeri;
    fs.writeFileSync(aktiflikYolu, JSON.stringify(aktiflikVerisi, null, 2));
    // console.log('Aktiflik güncellendi');
  } catch (e) {
    console.error('Aktiflik izleme sırasında hata:', e);
  }
});