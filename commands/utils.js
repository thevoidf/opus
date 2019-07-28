const fs = require('fs');
const path = require('path');
const request = require('request');
const { RichEmbed, Attachment } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('node-canvas');
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

	if (!url)
		({ url } = oldMessage.attachments.values().next().value);

	const image = await request(url);
	const filename = path.basename(image.path);
	const imagePath = `/tmp/${filename}`;

	image.pipe(fs.createWriteStream(imagePath)).on('close', async () => {
		const { width, height } = sizeOf(imagePath);

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');

		const baseFontSize = 40;
		const baseXOffset = 60;
		const baseYOffset = 80;
		const textSize = width > 400 ? baseFontSize : baseFontSize / 2;
		const xOffset = width > 400 ? baseXOffset : baseXOffset / 2;
		const yOffset = width > 400 ? baseYOffset : baseYOffset / 2;
		const memeFont = `${textSize}px monospace`;
		const bgColor = '#ffffff';
		const textColor = '#000000';

		ctx.font = memeFont;
		ctx.fillStyle = textColor;
		const lineCount = wrapText(ctx, text, xOffset, yOffset, width - baseXOffset, textSize);

		const bgHeight = (textSize * (lineCount + 1)) + yOffset;
		canvas.height = height + bgHeight;

		const img = await loadImage(imagePath);
		ctx.drawImage(img, 0, bgHeight);

		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, width, bgHeight);

		ctx.font = memeFont;
		ctx.fillStyle = textColor;
		wrapText(ctx, text, xOffset, yOffset, width - baseXOffset, textSize);

		oldMessage.delete();
		const attachment = new Attachment(canvas.toBuffer());
		message.channel.send(attachment);
	});
}

utils.invite = async ({ message, command, args }) => {
	const inviteURL = 'https://discordapp.com/oauth2/authorize?client_id=598902236680290375&permissions=8&scope=bot';
	message.channel.send(inviteURL);
}

registerFont('./assets/fonts/matrix.otf', { family: 'Matrix' });
registerFont('./assets/fonts/neon.ttf', { family: 'Neon' });
utils.imcool = async ({ message, command, args }) => {
	const oldMessage = message;

	const width = 500;
	const height = 500;
	const bgColor = '#ffffff';
	const textColor = '#000000';
	const textSize = 80;
	const fontEffects = {
		matrix: {
			shadowColor: '#008F11',
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			shadowBlur: 5,
			font: `${textSize}px Matrix`,
			fillStyle: '#008F11',
			strokeStyle: '#ffffff',
			lineWidth: 3,
			render: (ctx, text, xOffset, yOffset, textSize) => {
				ctx.strokeText(text, xOffset, textSize);
				ctx.fillText(text, yOffset, textSize);
			}
		},
		neon: {
			shadowColor: '#ff08e8',
			shadowOffsetX: -5,
			shadowOffsetY: 8,
			shadowBlur: 10,
			font:`${textSize}px Neon`,
			fillStyle: '#ff08e8',
			strokeStyle: '#ffffff',
			lineWidth: 3,
			render: (ctx, text, xOffset, yOffset, textSize) => {
				ctx.strokeText(text, xOffset, textSize);
				ctx.fillText(text, yOffset, textSize);
			}
		}
	}
	const coolArgs = args.join(' ').split('|').map(arg => arg.trim());
	const text = coolArgs[0];
	const effect = coolArgs[1] || 'neon';
	if (!fontEffects.hasOwnProperty(effect))
		return message.channel.send('Invalid font');

	let canvas = createCanvas(width, height);
	let ctx = canvas.getContext('2d');
	const font = fontEffects[effect].font;
	ctx.font = font;
	const textWidth = ctx.measureText(text).width + 20;

	canvas = createCanvas(textWidth, textSize * 2);
	ctx = canvas.getContext('2d');
	ctx.font = font;

	const renderFont = ({ ctx, effect, xOffset, yOffset, textSize }) => {
		const font = fontEffects[effect];
		for (const [prop, value] of Object.entries(font)) {
			if (prop === 'render')
				continue;
			ctx[prop] = value;
		}
		font.render(ctx, text, xOffset, yOffset, textSize);
	}

	renderFont({
		ctx,
		effect,
		xOffset: 20,
		yOffset: 20,
		textSize
	});

	oldMessage.delete();
	const attachment = new Attachment(canvas.toBuffer());
	message.channel.send(attachment);
}
