const ytdl = require('ytdl-core');

const queue = new Map();

module.exports = ({ message, command, args }) => {
	const { channel: textChannel, member: { voiceChannel } } = message;
	const serverQueue = queue.get(message.guild.id);

	return {
		play: async function() {
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
				return this.playTrack(message.guild, guildQueue.tracks[0]);
			}

			serverQueue.tracks.push(track);
			textChannel.send(`${track.title} added to queue`);
		},
		pause: async function() {
			if (!voiceChannel)
				return message.reply('You need to be in voice channel');
			serverQueue.connection.dispatcher.pause();
		},
		resume: async function() {
			if (!voiceChannel)
				return message.reply('You need to be in voice channel');
			serverQueue.connection.dispatcher.resume();
		},
		stop: async function() {
			serverQueue.tracks = [];
			serverQueue.connection.dispatcher.end();
		},
		skip: async function() {
			if (!serverQueue)
				return message.channel.send('No tracks to skip');
			serverQueue.connection.dispatcher.end();
		},
		leave: async function() {
			if (!voiceChannel)
				return message.reply('You need to be in voice channel');
			voiceChannel.leave();
		},
		playTrack: async function(guild, track) {
			const that = this;
			const serverQueue = queue.get(guild.id);

			if (!track) {
				queue.delete(guild.id);
				return serverQueue.textChannel.send('Done playing');
			}

			const dispatcher = serverQueue.connection.playStream(ytdl(track.url));
			dispatcher.on('end', () => {
				serverQueue.tracks.shift();
				that.playTrack(guild, serverQueue.tracks[0]);
			});
		}
	}
}
