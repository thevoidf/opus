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
