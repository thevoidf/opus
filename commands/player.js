const ytdl = require('ytdl-core');

const queue = new Map();

const player = module.exports = exports = {};

player.play = async ({ message, command, args }) => {
	const { channel: textChannel, member: { voiceChannel } } = message;
	const serverQueue = queue.get(message.guild.id);

	if (!voiceChannel)
		return message.reply('You need to be in voice channel');

	const { title, video_url: url } = await ytdl.getInfo(args[0]);
	const track = { title, url };

	if (!serverQueue) {
		const guildQueue = {
			textChannel,
			voiceChannel,
			tracks: [ track ]
		}

		queue.set(message.guild.id, guildQueue);

		const connection = await voiceChannel.join();
		guildQueue.connection = connection;
		return playTrack(message.guild, guildQueue.tracks[0]);
	}

	serverQueue.tracks.push(track);
	textChannel.send(`${track.title} added to queue`);
}

player.pause = async ({ message, command, args }) => {
	const { member: { voiceChannel } } = message;
	const serverQueue = queue.get(message.guild.id);

	if (!voiceChannel)
		return message.reply('You need to be in voice channel');
	serverQueue.connection.dispatcher.pause();
}

player.resume = async ({ message, command, args }) => {
	const { member: { voiceChannel } } = message;
	const serverQueue = queue.get(message.guild.id);

	if (!voiceChannel)
		return message.reply('You need to be in voice channel');
	serverQueue.connection.dispatcher.resume();
}

player.stop = async ({ message, command, args }) => {
	const serverQueue = queue.get(message.guild.id);
	serverQueue.tracks = [];
	serverQueue.connection.dispatcher.end();
}

player.skip = async ({ message, command, args }) => {
	const serverQueue = queue.get(message.guild.id);

	if (!serverQueue)
		return message.channel.send('No tracks to skip');
	serverQueue.connection.dispatcher.end();
}

player.leave = async ({ message, command, args }) => {
	const { member: { voiceChannel } } = message;

	if (!voiceChannel)
		return message.reply('You need to be in voice channel');
	voiceChannel.leave();
}

const playTrack = async (guild, track) => {
	const serverQueue = queue.get(guild.id);

	if (!track) {
		queue.delete(guild.id);
		return serverQueue.textChannel.send('Done playing');
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(track.url));
	dispatcher.on('end', () => {
		serverQueue.tracks.shift();
		playTrack(guild, serverQueue.tracks[0]);
	});
}
