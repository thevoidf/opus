const fs = require('fs');
const path = require('path');
const request = require('request');
const { RichEmbed, Attachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const sizeOf = require('image-size');
const { wrapText } = require('../utils');

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

utils.ping = async ({ message, command, args }) => {
	const oldMessage = await message.channel.send('Pinging...');
	const latency = oldMessage.createdTimestamp - message.createdTimestamp;
	const apiLatency = Math.round(message.client.ping);
	const ping = `:hourglass_flowing_sand: Latency ${latency} | API Latency ${apiLatency}`;
	oldMessage.edit(ping);
}

utils.mkmeme = async ({ message, command, args }) => {
	const memeText = args.join(' ');
	const oldMessage = message;

	if (memeText === '')
		return message.channel.send(`<PREFIX>mkmeme 'meme text goes here'`);

	const memeArgParts = memeText.split('|');
	const text = memeArgParts[0];
	let url = memeArgParts[1];
	let width, height;

	if (!url)
		({ url } = oldMessage.attachments.values().next().value);

	const image = await request(url);
	const filename = path.basename(image.path);
	const imagePath = `/tmp/${filename}`;

	image.pipe(fs.createWriteStream(imagePath)).on('close', async () => {
		const { width, height } = sizeOf(imagePath);

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');

		const textSize = 40;
		const xOffset = 60;
		const yOffset = 80;

		ctx.font = `${textSize}px monospace`;
		ctx.fillStyle = '#000000';
		const lineCount = wrapText(ctx, text, xOffset, yOffset, width - 60, textSize);

		const bgHeight = (textSize * (lineCount + 1)) + yOffset;
		canvas.height = height + bgHeight;

		const img = await loadImage(imagePath);
		ctx.drawImage(img, 0, bgHeight);

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, bgHeight);

		ctx.font = `${textSize}px monospace`;
		ctx.fillStyle = '#000000';
		wrapText(ctx, text, xOffset, yOffset, width - 60, textSize);

		oldMessage.delete();
		const attachment = new Attachment(canvas.toBuffer());
		message.channel.send(attachment);
	});
}

utils.invite = async ({ message, command, args }) => {
	const inviteURL = 'https://discordapp.com/oauth2/authorize?client_id=598902236680290375&permissions=8&scope=bot';
	message.channel.send(inviteURL);
}
