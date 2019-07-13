const Discord = require('discord.js');
const { EVENT_MESSAGE_CHANNEL } = process.env;

module.exports = {
	join: member => {
		const embeddedMessage = new Discord.RichEmbed()
			.setTitle(`Welcome <@${member.id}>`)
			.setDescription(`Plese type in ${member.guild.channels.get(EVENT_MESSAGE_CHANNEL).toString()}`)
			.setColor('#ffff00')
			.setThumbnail(member.user.avatarURL)
			.addField('Getting started', 'I don\'t kow just look around')
		member
			.guild
			.channels
			.get(EVENT_MESSAGE_CHANNEL)
			.send(embeddedMessage); 
	},
	leave: member => {
		member
			.guild
			.channels
			.get(EVENT_MESSAGE_CHANNEL)
			.send(`See ya <@${member.id}>`); 
	}
}
