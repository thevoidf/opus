const { RichEmbed } = require('discord.js');
const { LOG_CHANNEL } = process.env;

const events = module.exports = exports = {};

events.onGuildMemberAdd = member => {
	const { user: { username, avatarURL } } = member;
	const channel = member.guild.channels.get(LOG_CHANNEL);
	const embeddedMessage = memberAddMessage({ username, avatarURL, channel });

	member
		.guild
		.channels
		.get(LOG_CHANNEL)
		.send(embeddedMessage); 
}

events.onGuildMemberRemove = member => {
	member
		.guild
		.channels
		.get(LOG_CHANNEL)
		.send(`See ya <@${member.id}>`); 
}

const memberAddMessage = ({ username, avatarURL, channel }) => (
	new RichEmbed()
	.setTitle(`Welcome ${username}`)
	.setDescription(`Plese type in ${channel}`)
	.setColor('#ffff00')
	.setThumbnail(avatarURL)
	.addField('Getting started', 'I don\'t kow just look around')
);
