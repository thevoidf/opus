const ytdl = require('ytdl-core');

const queue = new Map();

const Player = exports = module.exports = {};

Player.play = async ({ message, command, args }) => {
	const { channel: textChannel, member: { voiceChannel } } = message;
	const serverQueue = queue.get(message.guild.id);

	if (!voiceChannel)
		return message.reply('You need to be in voice channel');

	const trackInfo = await ytdl.getInfo(args[0]);
	const track = {
		title: trackInfo.title,
		url: trackInfo.video_url,
	}

	if (!serverQueue) {
		const guildQueue = {
			textChannel,
			voiceChannel,
			tracks: []
		}

		queue.set(message.guild.id, guildQueue);
		guildQueue.tracks.push(track);

		const connection = await voiceChannel.join();
		guildQueue.connection = connection;
		return playTrack(message.guild, guildQueue.tracks[0]);
	}

	serverQueue.tracks.push(track);
	textChannel.send(`${track.title} added to queue`);
}

Player.pause = async ({ message, command, args }) => {
	const { member: { voiceChannel } } = message;
	const serverQueue = queue.get(message.guild.id);

	if (!voiceChannel)
		return message.reply('You need to be in voice channel');
	serverQueue.connection.dispatcher.pause();
}

Player.resume = async ({ message, command, args }) => {
	const { member: { voiceChannel } } = message;
	const serverQueue = queue.get(message.guild.id);

	if (!voiceChannel)
		return message.reply('You need to be in voice channel');
	serverQueue.connection.dispatcher.resume();
}

Player.stop = async ({ message, command, args }) => {
	const serverQueue = queue.get(message.guild.id);
	serverQueue.tracks = [];
	serverQueue.connection.dispatcher.end();
}

Player.skip = async ({ message, command, args }) => {
	const serverQueue = queue.get(message.guild.id);

	if (!serverQueue)
		return message.channel.send('No tracks to skip');
	serverQueue.connection.dispatcher.end();
}

Player.leave = async ({ message, command, args }) => {
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
