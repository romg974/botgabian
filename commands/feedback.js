const fs = require('fs');

module.exports = {
  name: 'feedback',
  description: 'Lien du feedback',
  aliases: [],
  usage: '',
  cooldown: 5,
  execute(msg, args, server) {
    let conf = JSON.parse(fs.readFileSync('./config.json'));
    if(conf.feedbackLink)
      msg.channel.send(`📰 Voici le lien pour le feedback : ${conf.feedbackLink}`);
    else
      msg.reply('❌ Le lien du feedback n\'est pas paramétré.. ')
  },
};
