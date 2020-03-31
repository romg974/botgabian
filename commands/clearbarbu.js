module.exports = {
  name: 'clearbarbu',
  description: 'Nettoyage des salons',
  aliases: [],
  usage: '',
  cooldown: 10,
  admin: true,
  execute(msg, args, server) {
    const channels = msg.guild.channels.cache.array();
    let whitelist = [], cleanlist = [];
    for(let i in channels){
      if(channels[i].type === 'text') {
        if (server.config.persistantChannels.indexOf(channels[i].id) !== -1) whitelist.push(channels[i].id);
        else cleanlist.push(channels[i].id);
      }
    }

    msg.channel.send('🧻🧻 Je vais nettoyer les channels suivants : '+cleanlist.map(x => `<#${x}>`).join(', '));
    msg.channel.send('🧹 Mais tqt je garde les channels suivants : '+whitelist.map(x => `<#${x}>`).join(', '));

    let nbs = [];
    for(let i in channels){
      if(cleanlist.indexOf(channels[i].id) !== -1){
        channels[i].messages.fetch({ limit: 100 }).then((messages) => {
          let msgarray = messages.array();
          nbs.push(msgarray.length);
          for(let j in msgarray){
            msgarray[j].delete().catch(() => console.error('lol'));
          }
          msg.channel.send(`:white_check_mark:  <#${channels[i].id}> ${msgarray.length} messages supprimés`)
        });
      }
    }

  },
};
