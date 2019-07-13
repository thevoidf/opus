const ytdl = require('ytdl-core');

const queue = new Map();

module.exports = async props => {
	const { message, command, commandArgs } = props;

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
	};

	if (command === 'leave') {
		if (!message.member.voiceChannel)
			return message.reply('You need to be in voice channel niga');
		message.member.voiceChannel.leave();
	}

	if (command === 'play') {
		const textChannel = message.channel;
		const voiceChannel = message.member.voiceChannel;

		if (!voiceChannel)
			return message.reply('You need to be in voice channel niga');

		const trackInfo = await ytdl.getInfo(commandArgs[0]);
		const track = {
			title: trackInfo.title,
			url: trackInfo.video_url,
		}

		if (!serverQueue) {
			const guildQueue = {
				textChannel,
				voiceChannel,
				tracks: [],
				volume: 5,
				playing: true
			}

			queue.set(message.guild.id, guildQueue);
			guildQueue.tracks.push(track);

			const connection = await voiceChannel.join();
			guildQueue.connection = connection;
			playTrack(message.guild, guildQueue.tracks[0]);
		} else {
			serverQueue.tracks.push(track);
			textChannel.send(`${track.title} added to queue`);
		}
	}

	if (command === 'skip') {
		if (queue.length === 0)
			return message.channel.send('No tracks to skip');
		serverQueue.connection.dispatcher.end();
	}

	if (command === 'stop') {
		serverQueue.tracks = [];
		serverQueue.connection.dispatcher.end();
	}

	if (command === 'pause') {
		if (!message.member.voiceChannel)
			return message.reply('You need to be in voice channel niga');
		serverQueue.connection.dispatcher.pause();
	}

	if (command === 'resume') {
		if (!message.member.voiceChannel)
			return message.reply('You need to be in voice channel niga');
		serverQueue.connection.dispatcher.resume();
	}
}
