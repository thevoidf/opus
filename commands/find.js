module.exports = async props => {
	const { message, command, commandArgs } = props;

	const { guild: { members } } = message;
	if (command === 'find') {
		const users = [];
		for (let [id, member] of members) {
			const { user } = member;
			// if (!user.bot && user.presence.status !== 'offline') {
			if (!user.bot)
				users.push(user);
		}

		const rand = Math.floor(Math.random() * (0 + users.length));
		const user = users[rand];
		message.channel.send(`Winner is <@${user.id}>`);
	}
}
