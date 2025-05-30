// komutlar/seviye.js
const fs = require('fs');
const path = require('path');

// Kelime verisi dosyasının yolu
const wordDataPath = path.join(__dirname, '..', 'data', 'kelimeVerisi.json');

// Kullanıcının seviyesini ve kelime sayısını almak
function viewLevel(userId) {
    let wordData = {};
    try {
        if (fs.existsSync(wordDataPath)) {
            wordData = JSON.parse(fs.readFileSync(wordDataPath, 'utf8'));
        }
    } catch (error) {
        console.error('Kelime verisi okuma hatası:', error);
    }

    if (!wordData[userId]) {
        wordData[userId] = { words: 0, level: 0 };
    }

    return wordData[userId];
}

// Seviye güncelleme fonksiyonu
function updateLevel(userId) {
    let wordData = {};
    try {
        if (fs.existsSync(wordDataPath)) {
            wordData = JSON.parse(fs.readFileSync(wordDataPath, 'utf8'));
        }
    } catch (error) {
        console.error('Kelime verisi okuma hatası:', error);
    }

    if (!wordData[userId]) {
        wordData[userId] = { words: 0, level: 0 };
    }

    // Seviye hesaplama
    const newLevel = Math.floor(wordData[userId].words / 1000);
    if (newLevel > wordData[userId].level) {
        wordData[userId].level = newLevel;
    }

    try {
        fs.writeFileSync(wordDataPath, JSON.stringify(wordData, null, 2));
    } catch (error) {
        console.error('Kelime verisi yazma hatası:', error);
    }
}

module.exports = {
    updateLevel,
    viewLevel,
};