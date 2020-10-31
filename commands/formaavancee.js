const fs = require('fs');

module.exports = {
  name: 'advanced',
  description: 'Lien de l\'inscription à la forma avancée',
  aliases: [],
  usage: '',
  cooldown: 5,
  execute(msg, args, server) {
    let conf = JSON.parse(fs.readFileSync('./config.json'));
    if(conf.advancedLink)
      msg.channel.send(`📰 Voici le lien pour l'inscription à la formation avancée : ${conf.advancedLink}`);
    else
      msg.reply('❌ Le lien du advanced n\'est pas paramétré.. ')
  },
};
