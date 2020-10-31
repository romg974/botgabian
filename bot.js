const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require('fs');



client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


const conf = require('./config.json');


var server  = {
  config: conf,
  token: conf['token'],
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('finir le diapo de la prochaine forma');
  //692400488569634908

});

client.on('message', async msg => {
  if(msg.author.bot) return;

  if(msg.author.id === "344173611168563201" && msg.content.toLowerCase().indexOf('brave bête') !== -1)
    return msg.reply('Merci maître :heart_eyes: ');

  if(msg.content.indexOf(server.config.prefix) !== 0) return;

  const args = msg.content.slice(server.config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if ((command.guildOnly || command.admin) && msg.channel.type !== 'text') {
    return msg.reply('Bah non en fait...');
  }

  if(command.admin){
    const gm = await msg.guild.members.fetch(msg.author.id);
    if(!gm.roles.cache.some(role => role.name === 'Admin')){
      return msg.reply('❌ Non petit chenapan...');
    }
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(msg.author.id)) {
    const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return msg.reply(`Attends encore ${timeLeft.toFixed(1)}s. 😉`);
    }
  }

  timestamps.set(msg.author.id, now);
  setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

  try {
    command.execute(msg, args, server);
  } catch (error) {
    console.error(error);
    msg.reply('J\'ai perdu. (Ou j\'ai planté mais je marche encore)');
  }

});

async function onReact(reaction, user, add){
  // When we receive a reaction we check if the reaction is partial or not
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
      await reaction.fetch();

    } catch (error) {
      console.log('Something went wrong when fetching the message: ', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  const msg = reaction.message;
  const lines = msg.content.split("\n");
  const guild = reaction.message.guild;

  if (reaction.message.channel.id !== server.config.rolesChannel)
    return;

  let react, role, roleObj, initiator;

  for(let i = 0; i < lines.length; i++){
    try{
      react = lines[i][0];

      if(reaction.emoji.name[0] == react){
        console.log(lines);
        role = lines[i].split('@')[1].replace('>', '').replace('&', '').trim();

        let roleObj = reaction.message.guild.roles.cache.get(role);

        guild.members.fetch(user.id).then(function(gm){
          if(add){
            gm.roles.add(roleObj);
            gm.send('✅ Je t\'ai rajouté le rôle '+roleObj.name);
          }
          else{
            gm.roles.remove(roleObj);
            gm.send('✅ Je t\'ai retiré le rôle '+roleObj.name);
          }
        });
      }

    }catch(err){
      console.log('petit fail', err);
    }

  }
}

client.on('messageReactionAdd', async (reaction, user) => {
  await onReact(reaction, user, true);
});

client.on('messageReactionRemove', async (reaction, user) => {
  await onReact(reaction, user, false);
});

// Prevent fails
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
client.on('disconnect', async () => {
  client.destroy();
  client.login(config.clientToken);
});
client.on("error", (err) => console.log(err));

client.login(server.token);
