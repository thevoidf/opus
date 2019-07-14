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
	const { content } = message;
	const prefix = content[0];
	let args = content.split(' ');
	const command = args[0].replace(PREFIX, '');
	args = args.splice(1);

	const messageProps = {
		message,
		command,
		args,
	}

	if (prefix !== PREFIX) return;

	registerCommand(command, findCommand(messageProps), ['find', 'test']);
	registerCommand(command, playerCommand(messageProps), [
		'play', 'stop', 'pause', 'resume', 'skip', 'leave'
	]);
});

function registerCommand(command, group, commands) {
	commands.forEach(cmd => {
		if (command === cmd)
			group[cmd]();
	});
}

client.login(TOKEN);
