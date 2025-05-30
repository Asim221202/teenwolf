const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  name: 'ship',
  description: 'Kullanıcıları shipler ve rastgele bir rakam belirler!',
  async execute(message, args) {
    let user1 = message.mentions.users.first();
    let user2 = message.mentions.users.size > 1 ? message.mentions.users.at(1) : null;

    // Eğer etiketlenmiş kullanıcı yoksa, yazan kullanıcıyı sunucudan rastgele biriyle shiple
    if (!user1 && !user2) {
      const members = await message.guild.members.fetch(); // Sunucudaki tüm üyeleri getiriyoruz
      const nonBotMembers = members.filter(member => !member.user.bot); // Botları filtreliyoruz
      const randomMember = nonBotMembers.random(); // Rastgele bir üye seçiyoruz
      user1 = message.author; // Komutu yazan kişi
      user2 = randomMember.user; // Rastgele seçilen kullanıcı
    } else if (!user1) {
      user1 = message.author; // Komutu yazan kişi
      user2 = message.mentions.users.first();
    } else if (!user2) {
      user2 = message.author; // Komutu yazan kişi
    }

    // Özel ship kontrolü: Eğer belirlenen iki kullanıcı shipleniyorsa, uyum oranı 100000
    const specialUser1Id = '1085933161101394050'; // Özel shiplenecek ilk kullanıcının ID'si
    const specialUser2Id = '1224046866971234365'; 
    const specialUser3Id = '996355790631862272'; // Yeni kullanıcı 3 ID'si
    const specialUser4Id = '564468317977575443'; // Yeni kullanıcı 4 ID'si
    const negativeUserId = '533727549625204747';

    let randomShipNumber;
    let specialMessage = ''; // Özel mesajı burada tanımlıyoruz

    // Özel ship kontrolleri
    if (
      (user1.id === specialUser1Id && user2.id === specialUser2Id) ||
      (user1.id === specialUser2Id && user2.id === specialUser1Id)
    ) {
      randomShipNumber = 10000; // Özel ship uyum oranı
      specialMessage = ''; // Özel mesaj
    } else if (
      (user1.id === specialUser3Id && user2.id === specialUser4Id) ||
      (user1.id === specialUser4Id && user2.id === specialUser3Id)
    ) {
      randomShipNumber = 100000; // 3. ve 4. kullanıcı için özel uyum oranı
      specialMessage = ''; // Özel mesaj
    } else {
      randomShipNumber = Math.floor(Math.random() * 100) + 1; // 1-100 arasında rastgele sayı
    }

    if (user1.id === negativeUserId || user2.id === negativeUserId) {
      randomShipNumber = Math.floor(Math.random() * -100) - 1; // Negatif bir sayı
    }

    // Canvas boyutlarını belirleyelim
    const canvas = createCanvas(800, 500); // Daha büyük boyut
    const ctx = canvas.getContext('2d');

    // Arka plan görseli
    const background = await loadImage('https://i.postimg.cc/nXtKDNWG/your-image.png'); // Yeni arka plan görseli
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Kullanıcı avatarları
    const avatar1 = await loadImage(user1.displayAvatarURL({ format: 'png', size: 256 })); // Avatar boyutunu büyüttük
    const avatar2 = await loadImage(user2.displayAvatarURL({ format: 'png', size: 256 })); // Avatar boyutunu büyüttük

    // Çerçeve rengi kırmızı ve boyutları ayarlandı
    const frameWidth = 220; // Çerçeve genişliği
    const frameHeight = 220; // Çerçeve yüksekliği

    // Çerçeve 1 (Kırmızı renk)
    ctx.strokeStyle = '#FF0000'; // Kırmızı renk
    ctx.lineWidth = 6;
    ctx.strokeRect(50 - 6, 150 - 6, frameWidth, frameHeight); // Sol avatar

    // Avatar 1
    ctx.drawImage(avatar1, 50, 150, 208, 208); // Avatarı büyüttük ve çerçeveye göre hizaladık

    // Çerçeve 2 (Kırmızı renk)
    ctx.strokeStyle = '#FF0000'; // Kırmızı renk
    ctx.lineWidth = 6;
    ctx.strokeRect(570 - 6, 150 - 6, frameWidth, frameHeight); // Sağ avatar

    // Avatar 2
    ctx.drawImage(avatar2, 570, 150, 208, 208); // Avatarı büyüttük ve çerçeveye göre hizaladık

    // Kullanıcı isimlerini avatarların üstüne yazalım (sunucudaki takma adlarını kullanıyoruz)
    ctx.fillStyle = '#ffffff'; // Yazı rengi beyaz
    ctx.font = '24px Arial'; // Yazı tipi ve boyutu
    ctx.textAlign = 'center'; // Metin ortalama
    ctx.fillText(user1.username, 50 + 110, 150 + 20); // Kullanıcı 1 ismi
    ctx.fillText(user2.username, 570 + 110, 150 + 20); // Kullanıcı 2 ismi

    // "Uyum Oranı" yazısını ortalayalım
    ctx.fillStyle = '#ffffff';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Uyum Oranı", canvas.width / 2, 100); // Ortaya yazdık

    // Dikey barın yüksekliğini uyum oranına göre belirleyelim
    const barHeight = 180; // Barın yüksekliği
    const barWidth = 20; // Barın genişliği
    const fillHeight = (randomShipNumber / 100) * barHeight; // Barın doluluk oranı

    ctx.fillStyle = '#FF0000'; // Bar rengini kırmızı yapalım
    ctx.fillRect(380, 150 + (barHeight - fillHeight), barWidth, fillHeight); // Barın dikey olmasını sağladık

    // Uyum yüzdesini barın altına ekleyelim
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.fillText(`${randomShipNumber}%`, 390, 350);

    // Canvas'ı Discord'a göndermek için MessageAttachment oluştur
    const attachment = new MessageAttachment(canvas.toBuffer(), 'ship-result.png');
    const contentMessage = specialMessage 
      ? `${specialMessage}\n${user1.username} ve ${user2.username} arasındaki uyum oranı: ${randomShipNumber}%`
      : `${user1.username} ve ${user2.username} arasındaki uyum oranı: ${randomShipNumber}%`;

    message.channel.send({
      content: contentMessage,
      files: [attachment],
    });
  },
};