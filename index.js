require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

const playerCommands = require('./commands/player');
const utilsCommands = require('./commands/utils');
const mathCommands = require('./commands/math');
const moderationCommands = require('./commands/moderation');
const { onGuildMemberAdd, onGuildMemberRemove } = require('./events/member');

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

	registerCommandGroup(commandArgs, moderationCommands, [
		'kick', 'ban', 'mute', 'unmute'
	]);
	registerCommandGroup(commandArgs, mathCommands, [
		'calc', 'pie', 'column'
	]);
	registerCommandGroup(commandArgs, playerCommands, [
		'play', 'stop', 'pause', 'resume', 'skip', 'leave'
	]);
	registerCommandGroup(commandArgs, utilsCommands, [
		'ping', 'invite', 'poll', 'find'
	]);
});

const registerCommandGroup = (args, group, commands) => {
	const { command } = args;
	commands.forEach(cmd => {
		if (command === cmd)
			group[cmd](args);
	});
}

client.login(TOKEN);
