const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    _id: String, // Discord kullanıcı ID'si
    balance: { type: Number, default: 0 },
    bank: { type: Number, default: 0 }
});

module.exports = mongoose.model('Balance', balanceSchema);
