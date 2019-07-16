const moderation = module.exports = exports = {};

moderation.kick = async ({ message, command, args }) => {
	const {
		channel,
		guild,
		mentions: { members },
		member: commander
	} = message;
	const reason = getReason(args);

	if (!guild) return;

	if (!commander.hasPermission('KICK_MEMBERS'))
		return channel.send('You dont have permission to kick users');

	if (members.size === 0)
		return channel.send('No one to kick');

	for (const [id, member] of members) {
		await member.kick(reason);
	}
}

moderation.ban = async ({ message, command, args }) => {
	const {
		channel,
		guild,
		mentions: { members },
		member: commander
	} = message;
	const reason = getReason(args);

	if (!guild) return;

	if (!commander.hasPermission('BAN_MEMBERS'))
		return channel.send('You dont have permission to ban users');

	if (members.size === 0)
		return channel.send('No one to ban');

	for (const [id, member] of members) {
		await member.ban({ reason });
	}
}

moderation.mute = async ({ message, command, args }) => {
	const {
		channel,
		guild,
		mentions: { members },
		member: commander
	} = message;
	const reason = getReason(args);

	if (!guild) return;

	if (!commander.hasPermission('MUTE_MEMBERS'))
		return channel.send('You dont have permission to mute users');

	if (members.size === 0)
		return channel.send('No one to mute');

	let muteRole = guild.roles.find(role => role.name === 'muted');
	if (!muteRole) {
		muteRole = await guild.createRole({
			name: 'muted',
			color: '#ff0000',
			permissions: []
		});
		for (const [id, channel] of guild.channels) {
			await channel.overwritePermissions(muteRole, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false
			});
		}
	}

	for (const [id, member] of members) {
		await member.addRole(muteRole.id, reason);
	}
}

moderation.unmute = async ({ message, command, args }) => {
	const {
		channel,
		guild,
		mentions: { members },
		member: commander
	} = message;
	const reason = getReason(args);

	if (!guild) return;

	if (!commander.hasPermission('MUTE_MEMBERS'))
		return channel.send('You dont have permission to mute users');

	if (members.size === 0)
		return channel.send('No one to mute');

	const muteRole = guild.roles.find(role => role.name === 'muted');
	if (!muteRole) return;

	for (const [id, member] of members) {
		const isMuted = member.roles.find(role => role.name === 'muted');
		if (!isMuted) continue;
		await member.removeRole(muteRole.id, reason);
	}
}

const getReason = args => args.filter(arg => !/<@[0-9]+>/.test(arg)).join(' ');
