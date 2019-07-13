require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const playerCommand = require('./commands/player');
const findCommand = require('./commands/find');
const { join, leave } = require('./events');

const { TOKEN, PREFIX } = process.env;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
	join(member);
});

client.on('guildMemberRemove', member => {
	leave(member);
});

client.on('message', async message => {
	const content = message.content;
	const prefix = content[0];
	const args = content.split(' ');
	const command = args[0].replace(PREFIX, '');
	const commandArgs = args.splice(1);

	const messageProps = {
		message,
		content,
		prefix,
		args,
		command,
		commandArgs,
	}

	if (prefix !== PREFIX) return;

	playerCommand(messageProps);
	findCommand(messageProps);
});

client.login(TOKEN);
