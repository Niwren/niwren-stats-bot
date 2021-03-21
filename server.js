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

client.rewards = [{ role: "785163569502617650", ses: 10000, yazı: 1000 }] // sesdeki 10000 = 10 saniye 

client.on('ready',() => {
  console.log("I'm Ready!")
  client.user.setStatus("dnd")
})

 client.on('message', async function(message){
    let prefix = "!";
    if(!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    var cmd = client.commands.get(args.shift()) 
    if(cmd) cmd.run(client, message, args);
})



client.on('message', async(message) => {
  if(!message.guild || message.author.bot || message.content.startsWith("!")) return;
  db.add(`messageData.${message.author.id}.channel.${message.channel.id}`, 1);
  db.push(`messageData.${message.author.id}.times`, {time: Date.now(), puan: 1})
  let dataOne = db.get(`messageData.${message.author.id}`) || {}
  let dataMessage =  Object.keys(dataOne).map(data => { return Object.values(dataOne[data]).reduce((a, b) => a + b, 0) })[0];

  let dataTwo = db.get(`voiceData.${message.author.id}`) || {}
  let dataVoice =  Object.keys(dataTwo).map(data => { return Object.values(dataTwo[data]).reduce((a, b) => a + b, 0) })[0];
   console.log(dataVoice)
  if(client.rewards.length >= 1){
    client.rewards.forEach(data => {
      if(dataMessage >= data.yazı){
        message.member.roles.add(data.role)
      } else if(dataVoice >= data.ses){
        message.member.roles.add(data.role)
      }
    }) 
  }
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

client.login('')
