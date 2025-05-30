const mongoose = require('mongoose');

const KullaniciSchema = new mongoose.Schema({
  kullaniciId: { type: String, required: true, unique: true },
  kullaniciAdi: { type: String, required: true, trim: true, maxlength: 30 },
  profilFoto: { type: String, default: null }
}, { timestamps: true });
const Kullanici = mongoose.model('Kullanici', KullaniciSchema);

const BioSchema = new mongoose.Schema({
  kullaniciId: { type: String, required: true, unique: true, ref: 'Kullanici' },
  bio: { type: String, default: '', maxlength: 200 }
}, { timestamps: true });
const Bio = mongoose.model('Bio', BioSchema);

const TakipSchema = new mongoose.Schema({
  takipEdenId: { type: String, required: true, ref: 'Kullanici', index: true },
  takipEdilenId: { type: String, required: true, ref: 'Kullanici', index: true }
}, { timestamps: true });
TakipSchema.index({ takipEdenId: 1, takipEdilenId: 1 }, { unique: true });
const Takip = mongoose.model('Takip', TakipSchema);

const GonderiSchema = new mongoose.Schema({
  yazarId: { type: String, required: true, ref: 'Kullanici', index: true },
  icerik: { type: String, required: true, maxlength: 500 },
  medyaUrl: { type: String, default: null },
  begeniSayisi: { type: Number, default: 0 }
}, { timestamps: true });
const Gonderi = mongoose.model('Gonderi', GonderiSchema);

module.exports = { Kullanici, Bio, Takip, Gonderi };
