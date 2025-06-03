const mongoose = require('mongoose');

const lastClaimedSchema = new mongoose.Schema({
    _id: String, // Discord kullanıcı ID'si
    lastClaimed: { type: Number, default: 0 }
});

module.exports = mongoose.model('LastClaimed', lastClaimedSchema);
