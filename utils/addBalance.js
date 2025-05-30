const fs = require('fs');
const balancePath = './data/balance.json';

function addBalance(userId, amount) {
    let balanceData = {};

    try {
        if (fs.existsSync(balancePath)) {
            balanceData = JSON.parse(fs.readFileSync(balancePath, 'utf8'));
        }
    } catch (error) {
        console.error('Bakiye verisi okuma hatası:', error);
    }

    if (!balanceData[userId]) {
        balanceData[userId] = { balance: 0 };
    }

    balanceData[userId].balance += amount;

    try {
        fs.writeFileSync(balancePath, JSON.stringify(balanceData, null, 2));
    } catch (error) {
        console.error('Bakiye verisi yazma hatası:', error);
    }
}

module.exports = { addBalance };