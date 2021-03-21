const db = require('quick.db');
const { MessageEmbed } = require('discord.js')

const moment = require('moment')
require('moment-duration-format')
moment.locale('tr')

module.exports = {
        name: 'me',
        aliases: ['stat'],
        run: async(client, message, args) => {


                let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author

                let dataMessage = await db.get(`messageData.${member.id}.channel`) || {};
                let dataVoice = await db.get(`voiceData.${member.id}.channel`) || {};

                let messageData = Object.keys(dataMessage).map(id => {
                    return {
                        channelID: id,
                        totalMessage: dataMessage[id]
                    }
                }).sort((a, b) => b.totalMessage - a.totalMessage);

                let voiceData = Object.keys(dataVoice).map(id => {
                    return {
                        channelID: id,
                        totalTime: dataVoice[id]
                    }
                }).sort((a, b) => b.totalTime - a.totalTime);

                let dataMessage0 = await db.get(`messageData.${member.id}.times`) || [{ time: 0, puan: 0 }, { time: 0, puan: 0 }];
                let dataVoice0 = await db.get(`voiceData.${member.id}.times`) || [{ time: 0, puan: 0 }, { time: 0, puan: 0 }];

                let messageData0 = Object.values(dataMessage0).map(id => {
                    return {
                        time: id.time,
                        puan: id.puan
                    };
                })
                let voiceData0 = Object.values(dataVoice0).map(id => {
                    return {
                        time: id.time,
                        puan: id.puan
                    };
                })

                let message14 = messageData0.filter(data => (Date.now() - (86400000 * 30)) < data.time).reduce((a, b) => a + b.puan, 0);
                let message7 = messageData0.filter(data => (Date.now() - (86400000 * 7)) < data.time).reduce((a, b) => a + b.puan, 0);
                let message24 = messageData0.filter(data => (Date.now() - 86400000) < data.time).reduce((a, b) => a + b.puan, 0);

                let ses14 = voiceData0.filter(data => (Date.now() - (86400000 * 30)) < data.time).reduce((a, b) => a + b.puan, 0);
                let ses7 = voiceData0.filter(data => (Date.now() - (86400000 * 7)) < data.time).reduce((a, b) => a + b.puan, 0);
                let ses24 = voiceData0.filter(data => (Date.now() - 86400000) < data.time).reduce((a, b) => a + b.puan, 0);
                let davetsayi = db.fetch(`davetsayi.${member.id}.${message.guild.id}`)

                const embed = new MessageEmbed()
                    .setColor('BLACK')
                    .setThumbnail(member.avatarURL({ dynamic: true }))
                    .setDescription(`${member} - (${member.id})\n\nSon 14 Gün içindeki kullanıcı ses ve chat istatistikleri.
                   
                    \`Genel ses istatistikleri:\` ${moment.duration(dataVoice).format("M [Ay], W [Hafta], DD [Gün], HH [Saat], mm [Dakika], ss [Saniye]")} 
                    \`Genel text istatistikleri:\` ${dataMessage} mesaj
                   
                   
                    \`Günlük Ses Ve Text İstatistikleri:\`
					⦁ **Text**: ${message24} mesaj
					⦁ **Voice**${moment.duration(ses24).format("M [Ay], W [Hafta], DD [Gün], HH [Saat], mm [Dakika], ss [Saniye]")} 
                   \`Haftalık Ses Ve Text İstatistikleri:\`
				    ⦁ **Text**: ${message7} mesaj
					⦁ **Voice**: ${moment.duration(ses7).format("M [Ay], W [Hafta], DD [Gün], HH [Saat], mm [Dakika], ss [Saniye]")} 
                   \`Aylık Ses Ve Text İstatistikleri:\` 
				    ⦁ **Text**: ${message14} mesaj
					⦁ **Voice**: ${moment.duration(ses14).format("M [Ay], W [Hafta], DD [Gün], HH [Saat], mm [Dakika], ss [Saniye]")} 
                   
                   \` Aktif Olduğu Ses kanalı\` ${voiceData[0] ? `<#${voiceData[0].channelID}>` : 'Veri Yok!'}: \`${voiceData[0] ? moment.duration(voiceData[0].totalTime).format("M [Ay], W [Hafta], DD [Gün], HH [Saat], mm [Dakika], ss [Saniye]") : 'Veri Yok!'}\`
                   \` Aktif Olduğu Text kanalı\` ${messageData[0] ? `<#${messageData[0].channelID}>` : "Veri Yok"}: \`${messageData[0] ? messageData[0].totalMessage : 0} Mesaj\``)
    .setFooter(client.user.username, client.user.avatarURL())
    .setTimestamp()
    message.channel.send(embed)
  }
}
