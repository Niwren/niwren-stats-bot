const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const fs = require('fs');
const db = require('quick.db');
const moment = require('moment')
require('moment-duration-format')
const commands = client.commands = new Discord.Collection();

fs.readdirSync('./commands', {encoding: 'utf8'}).filter(file => file.endsWith(".js")).forEach((files) => {
  let command = require(`./commands/${files}`);
  if(!command.name) return console.log(`Hatalı Kod Dosyası => [/commands/${files}]`)
  commands.set(command.name, command);
})


client.on('ready',() => {
    console.log("I'm Ready!")
    client.user.setPresence({ activity: { name: 'Niwren ❤️ Serendia' }, status: 'idle' })
})

 client.on('message', async function(message){
    let prefix = "!";
    if(!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    var cmd = client.commands.get(args.shift()) 
    if(cmd) cmd.run(client, message, args);
})



client.on('message', async(message) => {
  if(!message.guild || message.author.bot || message.content.startsWith(client.prefix)) return;
  db.add(`messageData.${message.author.id}.channel.${message.channel.id}`, 1);
  db.push(`messageData.${message.author.id}.times`, {time: Date.now(), puan: 1})
})

const Activites = new Map();

client.on('voiceStateUpdate', (oldState, newState) => {
  if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return
  if(!oldState.channelID && newState.channelID) { 
    Activites.set(oldState.id, Date.now());
  }
      let data;
    if(!Activites.has(oldState.id)){
        data = Date.now();
        Activites.set(oldState.id, data); 
    } else data = Activites.get(oldState.id);
  
    let duration = Date.now() - data;
    if(oldState.channelID && !newState.channelID) { 
        Activites.delete(oldState.id);
        db.add(`voiceData.${oldState.id}.channel.${oldState.channelID}`, duration);
        db.push(`voiceData.${oldState.id}.times`, {time: Date.now(), puan:  duration})
    } else if(oldState.channelID && newState.channelID){
        Activites.set(oldState.id, Date.now());
        db.add(`voiceData.${oldState.id}.channel.${oldState.channelID}`, duration);
        db.push(`voiceData.${oldState.id}.times`, {time: Date.now(), puan:  duration})
    }
  
})

client.login('ODE3NDU0NzI3NDM1NzgwMTU3.YEJwCg.EjPkRHj6e3PIfacrLtY9J6CO_ho')
