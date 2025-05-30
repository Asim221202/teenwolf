const {
  joinVoiceChannel,
  createAudioPlayer,
  entersState,
  VoiceConnectionStatus,
  AudioReceiveStream,
  createAudioResource,
} = require('@discordjs/voice');
const prism = require('prism-media');
const fs = require('node:fs');
const path = require('node:path');
const { AttachmentBuilder } = require('discord.js'); // v13 için MessageAttachment kullanın

module.exports = {
  name: 'ses-kayıt',
  description: 'Basit ses kaydı testi (PCM olarak gönderir).',
  async execute(message) {
    if (!message.member.voice.channel) {
      return message.reply('Ses kanalına katılmanız gerekiyor!');
    }

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    const receiver = connection.receiver;
    const buffers = [];

    receiver.subscribe(message.member.id, {
      end: {
        behavior: 'manual',
      },
    }).on('data', chunk => {
      buffers.push(chunk);
    });

    message.reply('Ses kaydı başladı (10 saniye)!');

    setTimeout(() => {
      receiver.subscriptions.get(message.member.id)?.destroy();
      connection.destroy();

      const fullBuffer = Buffer.concat(buffers);
      const attachment = new AttachmentBuilder(fullBuffer, { name: `test_kaydı-${Date.now()}.pcm` }); // v13 için MessageAttachment kullanın

      message.channel.send({ content: 'Test kaydı tamamlandı!', files: [attachment] });
    }, 10000);
  },
};
