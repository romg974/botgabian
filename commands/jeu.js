module.exports = {
  name: 'jeu',
  description: 'Jeu',
  aliases: [],
  usage: '[nom d\'utilisateur]',
  cooldown: 10,
  execute(msg, args, server) {
    console.log(args);
    if(Math.random() > 0.5)
      msg.reply('Tu bois ! 🍺');
    else
      msg.reply('Tu bois pas.')
  },
};
