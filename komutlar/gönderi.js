const db = require('../database');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const musicIcons = require('../icons.js'); // icons.js dosyasını import ettik

const GONDERI_KANALI_ID = '1330632714763763833';
const BEGENI_EMOJI = '❤️';

module.exports = {
    name: 'paylaş',
    description: 'Yeni bir gönderi paylaşır (isteğe bağlı metin ve fotoğraf/video ekleri veya URL).',
    usage: '.paylaş <metin> [fotoğraf/video URL veya ek]',
    async execute(message, args) {
        try {
            const icerik = args.join(' ').trim() || null;
            const medyaEki = message.attachments.first();
            const yazarId = message.author.id;
            const olusturmaTarihi = new Date().toISOString();
            let medyaUrl = null;

            // Kullanıcının kayıtlı olup olmadığını kontrol et
            db.get(`SELECT kullaniciAdi FROM kullanicilar WHERE kullaniciId = ?`, [yazarId], async (err, kullanici) => {
                if (err) {
                    console.error('[paylaş] Kullanıcı kontrol edilirken hata:', err.message);
                    return message.reply('Gönderi paylaşılamadı. Bir hata meydana geldi.');
                }
                if (!kullanici) {
                    return message.reply('Sadece kayıtlı kullanıcılar gönderi paylaşabilir.');
                }

                if (medyaEki) {
                    medyaUrl = medyaEki.url;
                } else if (args.length > 0 && (args[args.length - 1].startsWith('http://') || args[args.length - 1].startsWith('https://'))) {
                    medyaUrl = args.pop();
                }

                if (!icerik && !medyaUrl && !medyaEki) {
                    return message.reply('Lütfen bir metin, bir fotoğraf/video URL veya bir dosya eki ekleyin.');
                }

                db.run(`
                    INSERT INTO gonderiler (yazarId, icerik, medyaUrl, olusturmaTarihi)
                    VALUES (?, ?, ?, ?)
                `, [yazarId, icerik, medyaUrl || null, olusturmaTarihi], async function(err) {
                    if (err) {
                        console.error('[paylaş] Gönderi veritabanına kaydedilirken hata:', err.message);
                        return message.reply('Gönderi paylaşılamadı. Bir hata meydana geldi.');
                    }

                    const gonderiId = this.lastID;

                    const gonderiKanal = message.client.channels.cache.get(GONDERI_KANALI_ID);
                    if (gonderiKanal) {
                        const mesajPayload = {
                            embeds: [],
                            files: []
                        };
                        let gonderildi = false;

                        const medyaUzantisi = medyaUrl ? medyaUrl.split('.').pop().toLowerCase() : null;
                        const isVideo = medyaUzantisi === 'mp4' || medyaUzantisi === 'webm' || medyaUzantisi === 'mov';
                        const isVideoEki = medyaEki?.url.endsWith('.mp4') || medyaEki?.url.endsWith('.webm') || medyaEki?.url.endsWith('.mov');

                        if (isVideo || isVideoEki) {
                            const videoAttachment = medyaEki ? new MessageAttachment(medyaEki.url) : (medyaUrl ? medyaUrl : null);
                            if (videoAttachment) {
                                await gonderiKanal.send({ content: icerik || '', files: [videoAttachment] });
                                gonderildi = true;
                            }
                            const gonderiEmbed = new MessageEmbed()
                                .setColor('#ffffff')
                                .setAuthor({ name: kullanici.kullaniciAdi || message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                .setTimestamp(olusturmaTarihi)
                                .setFooter(`Gönderi ID: ${gonderiId} | Video Gönderisi`, musicIcons.instagram);
                            mesajPayload.embeds.push(gonderiEmbed);
                        } else {
                            const gonderiEmbed = new MessageEmbed()
                                .setColor('#ffffff')
                                .setAuthor({ name: kullanici.kullaniciAdi || message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                .setTimestamp(olusturmaTarihi)
                                .setFooter(`Gönderi ID: ${gonderiId}`, musicIcons.instagram);

                            if (icerik) {
                                gonderiEmbed.setDescription(icerik);
                            }

                            if (medyaUrl) {
                                gonderiEmbed.setImage(medyaUrl);
                            } else if (medyaEki) {
                                gonderiEmbed.setImage(medyaEki.url);
                            }

                            mesajPayload.embeds.push(gonderiEmbed);
                        }

                        let gonderiMesaji;
                        if (!gonderildi) {
                            gonderiMesaji = await gonderiKanal.send(mesajPayload);
                        } else {
                            gonderiMesaji = await gonderiKanal.send({ embeds: mesajPayload.embeds });
                        }

                        await gonderiMesaji.react(BEGENI_EMOJI);

                        // Gönderi ID ve kanal ID'sini (gerekirse) veritabanına kaydedebilirsiniz.
                        // Örneğin:
                        db.run(`UPDATE gonderiler SET mesajId = ?, kanalId = ? WHERE gonderiId = ?`, [gonderiMesaji.id, gonderiKanal.id, gonderiId], (err) => {
                            if (err) {
                                console.error('[paylaş] Mesaj ID ve kanal ID kaydedilirken hata:', err.message);
                            }
                        });

                        message.react('✅');

                    } else {
                        console.error('[paylaş] Gönderi kanalı ID geçersiz.');
                        message.reply('Gönderi kanalı ayarlanamadı. Lütfen bot yöneticisiyle iletişime geçin.');
                    }
                });
            });
        } catch (error) {
            console.error('[paylaş] Bir hata oluştu:', error);
            message.reply('Gönderi paylaşılamadı. Bir hata meydana geldi.');
        }
    },
};

module.exports.help = {
    name: 'paylaş',
    description: 'Yeni bir gönderi paylaşır (isteğe bağlı metin ve fotoğraf/video ekleri veya URL).',
    usage: '.paylaş <metin> [fotoğraf/video URL veya ek]',
};
