const { RichEmbed } = require('discord.js');
const { EVENT_MESSAGE_CHANNEL } = process.env;

const MemberEvents = exports = module.exports = {};

MemberEvents.onGuildMemberAdd = member => {
	const embeddedMessage = new RichEmbed()
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
}

MemberEvents.onGuildMemberRemove = member => {
	member
		.guild
		.channels
		.get(EVENT_MESSAGE_CHANNEL)
		.send(`See ya <@${member.id}>`); 
}
