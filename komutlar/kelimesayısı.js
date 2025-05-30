const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kelimesayısı',
  description: 'Yanıtlanan mesajdaki kelime sayısını gösterir.',
  execute(message) {
    // Yanıtlanan mesajı kontrol et
    const repliedMessage = message.reference
      ? message.channel.messages.cache.get(message.reference.messageId)
      : null;

    if (!repliedMessage) {
      return message.reply('Lütfen bir mesajı yanıtlayarak bu komutu kullanın.');
    }

    // Yanıtlanan mesajın içeriğinden kelime sayısını hesapla
    const wordCount = repliedMessage.content.trim().split(/\s+/).length;

    // Sonucu embed şeklinde gönder
    const embed = new MessageEmbed()
      .setColor('#7289da')
      .setTitle('Kelime Sayısı')
      .setDescription(`Yanıtladığınız mesajda **${wordCount}** kelime var.`)
      .setFooter(`Yanıtlanan mesaj: ${repliedMessage.id}`);

    message.reply({ embeds: [embed] });
  },
};