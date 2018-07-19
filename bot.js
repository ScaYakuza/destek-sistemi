const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const { RichEmbed } = require('discord.js'); 

var prefix = ayarlar.prefix;

client.on('ready', () => {
    console.log(`Destek Sistemi Devrede!`);
    client.user.setStatus('idle')
    client.setInterval(() => {
        client.user.setActivity(`Otomatik Destek Sistemi!`, { type: "WATCHING" });
        client.user.setActivity(`Sunucuna Eklemek İçin Beni Etiketle!`, { type: "WATCHING" });
        client.user.setActivity(`${client.guilds.size} Sunucu | ${client.users.size} Kullanıcı`, { type: "WATCHING" });
    }, 15000);
  });

client.on('message', message => {
        if (message.content.toLowerCase() === '<@468776033257259016>') {
          message.reply('**Beni Ekle! Link:** https://discordapp.com/api/oauth2/authorize?client_id=469407977875570708&permissions=0&scope=bot')
        }
});

client.on('guildCreate', async guild => {
  const eklendim = new RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Hey!`)
  .setDescription(`Beni sunucuna eklediğin için teşekkürler ! \nAsıl Better Botu eklemeyide unutma!`)
  .addField(`Better Bot Link:`, `[Bana Tıkla!](https://discordapp.com/oauth2/authorize?client_id=457547769159352341&scope=bot&permissions=2146958591)`)
  .addField(`Destek Sunucusu:`, `[Bana Tıkla!](https://discord.gg/rc5kfTU)`)
  .addField(`Destek Sistemi | Kurulum:`, `Merhaba ! \nDestek Sistemini kullanabilmek için; \n\`-\` **Destek Ekibi** isminde bir rol oluşturup yetkililere veriniz. \n\`-\` **destek-kanalı** isminde bir metin/yazı kanalı oluşturunuz. \nBunları yaptıysanız **destek-kanalı** ismindeki metin/yazı kanalına mesaj yazdığınızda otomatik olarak destek talebi açılacaktır. \nDestek Sistemi artık sunucunuzda aktiftir!`)
  guild.createChannel(`better-bot-bilgi`, "text").then(g => {
  g.send(eklendim)
})
})

client.on('message', message => { 
  const reason = message.content.split(" ").slice(1).join(" ");
  if (!message.channel.name.startsWith(`destek-kanalı`)) return;
    if (!message.guild.roles.exists("name", "Destek Ekibi"));
  message.guild.createChannel(`talep-${message.author.id}`, "text").then(c => {
      let role = message.guild.roles.find("name", "Destek Ekibi");
      let role2 = message.guild.roles.find("name", "@here");
      c.overwritePermissions(role, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
      c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
      });
      c.overwritePermissions(message.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });

      const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`Better Bot | Destek Modülü`, client.user.avatarURL)
      .addField(`Merhaba ${message.author.username}!`, `Destek Ekibimiz burada sizinle ilgilenecektir. \n- Destek talebini kapatmak için \`b!kapat\` yazabilirsin!`)
      .setFooter(`Better Bot | Destek Modülü`, client.user.avatarURL)
      .setTimestamp();
      c.send({ embed: embed });
      c.send(`<@${message.author.id}> Adlı kullanıcı "${message.content}" sebebi ile destek talebi açtı! @here`)
      message.delete();
  }).catch(console.error);
})

client.on('message', message => {
if (message.content.toLowerCase().startsWith(prefix + `kapat`)) {
  if (!message.channel.name.startsWith(`talep-`)) return message.channel.send(`Bu komut sadece destek talebi kanallarında kullanılabilir.`);

  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Destek Talebi Kapatma İşlemi`, client.user.avatarURL)
  .setDescription(`Destek talebini kapatmayı onaylamak için, \n10 saniye içinde \`evet\` yazmanız gerekmektedir.`)
  .setFooter(`Better Bot | Destek Modülü`, client.user.avatarURL)
  .setTimestamp()
  message.channel.send({embed})
  .then((m) => {
    message.channel.awaitMessages(response => response.content === 'evet', {
      max: 1,
      time: 10000,
      errors: ['time'],
    })
    .then((collected) => {
        message.channel.delete();
      })
      .catch(() => {
        m.edit('Destek talebi kapatma isteğin zaman aşımına uğradı.').then(m2 => {
            m2.delete();
        }, 3000);
      });
  });
  }
})
  
client.login(ayarlar.token);
