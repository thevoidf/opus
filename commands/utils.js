const { RichEmbed } = require('discord.js');

const utils = module.exports = exports = {};

const numberToEmote = {
	'0': '\u0030\u20E3',
	'1': '\u0031\u20E3',
	'2': '\u0032\u20E3',
	'3': '\u0033\u20E3',
	'4': '\u0034\u20E3',
	'5': '\u0035\u20E3',
	'6': '\u0036\u20E3',
	'7': '\u0037\u20E3',
	'8': '\u0038\u20E3',
	'9': '\u0039\u20E3'
}
const zeroWidth = '\u200b';

utils.poll = async ({ message, command, args }) => {
	const { channel, member } = message;

	if (args.length === 0)
		return channel.send('Question | answer1 | answer2');
	const pollArgs = args.join(' ').split('|');
	const description = pollArgs[0];
	if (pollArgs.length < 3)
		return channel.send('You need to desciption and at least 2 answers');
	if (pollArgs.length > 10)
		return channel.send('You cant have more than 9 answers sorry');
	const answers = pollArgs.splice(1);

	await message.delete();

	const pollEmbed = new RichEmbed()
		.setTitle(`${member.displayName}'s poll`)
		.setDescription(description)
		.setColor('#ffff00');

	for (const [i, answer] of answers.entries()) {
		const answerWithNumber = numberToEmote[i + 1] + ' ' + answer;
		pollEmbed.addField(answerWithNumber, zeroWidth);
	}

	const pollMessage = await channel.send(pollEmbed);
	for (const [i, answer] of answers.reverse().entries()) {
		await pollMessage.react(numberToEmote[i + 1]);
	}
}

utils.find = ({ message, command, args }) => {
	const { channel, guild: { members } } = message;
	const users = [];

	for (const [id, member] of members) {
		const { user } = member;
		if (!user.bot)
			users.push(user);
	}

	const rand = Math.floor(Math.random() * (0 + users.length));
	const user = users[rand];
	channel.send(`Winner is <@${user.id}>`);
}
