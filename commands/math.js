const { Attachment } = require('discord.js');
const {
	makePieChart,
	makeColumnChart,
	destroyChart
} = require('../utils/data');

const math = module.exports = exports = {};

const context = `
'use strict';

const pow = Math.pow;
const cos = Math.cos;
const sin = Math.sin;
const pi = Math.PI;
`;
const regex = /[-\\*/,.()\s+\d]|\bpow\b|\bcos\b|\bsin\b|\bpi\b/g;

math.calc = ({ message, command, args }) => {
	const { channel } = message;

	if (args.length === 0)
		return channel.send('Plese do some math');

	const math = args.join('');
	const match = math.match(regex);

	if (!match)
		return channel.send('Invalid input');

	if (match.join('') !== math)
		return channel.send('Invalid input');

	const calculation = context + math;

	const output = eval(calculation);
	channel.send(':nerd: ' + output);
}

math.pie = async ({ message, command, args }) => {
	const { channel } = message;

	if (args.length === 0)
		return channel.send('label value label value...');

	const labels = args.filter((arg, i) => i % 2 === 0);
	const data = args.filter((arg, i) => i % 2 !== 0);
	const isLabel = labels.every(label => label !== '');
	const isData = data.every(data => !isNaN(data));

	if (labels.length !== data.length)
		return channel.send('label value label value...');
	if (!isLabel)
		return channel.send('invalid label');
	if (!isData)
		return channel.send('data needs to be number');
	if (labels.length > 9)
		return channel.send('cant have more than 9 things');

	const chartBuffer = await makePieChart({ data, labels });
	const attachment = new Attachment(chartBuffer);
	channel.send(attachment);
	destroyChart();
}

math.column = async ({ message, command, args }) => {
	const { channel } = message;

	if (args.length === 0)
		return channel.send('label value label value...');

	const labels = args.filter((arg, i) => i % 2 === 0);
	const data = args.filter((arg, i) => i % 2 !== 0);
	const isLabel = labels.every(label => label !== '');
	const isData = data.every(data => !isNaN(data));

	if (labels.length !== data.length)
		return channel.send('label value label value...');
	if (!isLabel)
		return channel.send('invalid label');
	if (!isData)
		return channel.send('data needs to be number');
	if (labels.length > 9)
		return channel.send('cant have more than 9 things');

	const chartBuffer = await makeColumnChart({ data, labels });
	const attachment = new Attachment(chartBuffer);
	channel.send(attachment);
	destroyChart();
}
