require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const playerCommand = require('./commands/player');
const findCommand = require('./commands/find');
const { onGuildMemberAdd, onGuildMemberRemove } = require('./events');

const { TOKEN, PREFIX } = process.env;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', onGuildMemberAdd);
client.on('guildMemberRemove', onGuildMemberRemove);

client.on('message', async message => {
	const { content } = message;
	const prefix = content[0];
	let args = content.split(' ');
	const command = args[0].replace(PREFIX, '');
	args = args.splice(1);

	const commandArgs = {
		message,
		command,
		args
	}

	if (prefix !== PREFIX) return;

	registerCommand(commandArgs, findCommand, ['find']);
	registerCommand(commandArgs, playerCommand, [
		'play', 'stop', 'pause', 'resume', 'skip', 'leave'
	]);
});

function registerCommand(args, group, commands) {
	const { command } = args;
	commands.forEach(cmd => {
		if (command === cmd)
			group[cmd](args);
	});
}

client.login(TOKEN);
