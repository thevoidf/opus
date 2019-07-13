const ytdl = require('ytdl-core');

const queue = new Map();

module.exports = async props => {
	const { message, command, commandArgs } = props;
	const { channel: textChannel, member: { voiceChannel } } = message;
	const serverQueue = queue.get(message.guild.id);

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

	if (command === 'play') {
		if (!voiceChannel)
			return message.reply('You need to be in voice channel');

		const trackInfo = await ytdl.getInfo(commandArgs[0]);
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

	if (command === 'skip') {
		if (!serverQueue)
			return message.channel.send('No tracks to skip');
		serverQueue.connection.dispatcher.end();
	}

	if (command === 'stop') {
		serverQueue.tracks = [];
		serverQueue.connection.dispatcher.end();
	}

	if (command === 'pause') {
		if (!voiceChannel)
			return message.reply('You need to be in voice channel');
		serverQueue.connection.dispatcher.pause();
	}

	if (command === 'resume') {
		if (!voiceChannel)
			return message.reply('You need to be in voice channel');
		serverQueue.connection.dispatcher.resume();
	}

	if (command === 'leave') {
		if (!voiceChannel)
			return message.reply('You need to be in voice channel');
		voiceChannel.leave();
	}
}
