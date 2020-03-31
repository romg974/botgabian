const fs = require('fs');

module.exports = {
  name: 'gabian',
  description: 'Jeu',
  aliases: [],
  usage: '[nom d\'utilisateur]',
  cooldown: 5,
  execute(msg, args, server) {
    let conf = JSON.parse(fs.readFileSync('./config.json'));
    if(conf.gabianLink)
      msg.channel.send(`📰 Voilà le gabian du jour : ${conf.gabianLink}`);
    else
      msg.reply('❌ Le gabian du jour n\'est pas encore sorti... ')
  },
};
