module.exports.find = ({ message, command, args }) => {
	const { guild: { members } } = message;
	const users = [];

	for (let [id, member] of members) {
		const { user } = member;
		if (!user.bot)
			users.push(user);
	}

	const rand = Math.floor(Math.random() * (0 + users.length));
	const user = users[rand];
	message.channel.send(`Winner is <@${user.id}>`);
}
