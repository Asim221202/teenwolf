const client = require('../index');  // client'ı index.js'den içe aktarıyoruz

module.exports = {
  name: 'çekiliş',
  description: 'Çekiliş başlatır.',
  async execute(message, args) {
    // Çekilişi başlatmak için izin kontrolü
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('Bu komutu kullanmak için yönetici iznine sahip olmalısınız.');
    }

    // Komut argümanları kontrolü
    const prize = args[0]; // Ödül
    const numberOfWinners = parseInt(args[1]); // Kazanan kişi sayısı
    const roleName = args[2]; // Katılacak rol

    if (!prize || isNaN(numberOfWinners) || !roleName) {
      return message.reply('Lütfen ödül, kazanan sayısı ve katılacak rolü belirtin.');
    }

    // Katılacak rolün doğruluğunu kontrol etme
    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    if (!role) {
      return message.reply(`Belirttiğiniz ${roleName} rolü bulunamadı.`);
    }

    // Çekilişi başlatma
    try {
      client.giveawayManager.start(message.channel, {
        prize: prize,
        winnerCount: numberOfWinners,
        duration: 60000, // 1 dakika
        hostedBy: message.author,
        messages: {
          giveaway: '🎉 **Çekiliş Başladı!** 🎉',
          giveawayEnded: '🎉 **Çekiliş Sona Erdi!** 🎉',
          winMessage: 'Tebrikler {winners}! Kazandığınız ödül: **{prize}**',
        },
        extraData: {
          roleId: role.id,  // Katılacak rol
        },
      });

      message.channel.send(`Çekiliş başlatıldı! Ödül: **${prize}**, Kazanan Sayısı: **${numberOfWinners}**, Süre: **1 dakika**, Katılmak için **${roleName}** rolüne sahip olmanız gerekiyor.`);
    } catch (error) {
      console.error('Çekiliş başlatılamadı:', error);
      message.reply('Çekiliş başlatılırken bir hata oluştu.');
    }
  },
};