module.exports = {
  name: 'reload',
  description: 'reload',
  aliases: [],
  admin: true,
  usage: '[nom d\'utilisateur]',
  cooldown: 5,
  execute(msg, args, server) {
    let conf = require('../config.json');
    server.config = conf;
    msg.channel.send(':white_check_mark: Config rechargée');
  },
};
