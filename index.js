const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const distube = new DisTube(client, {
  plugins: [new SpotifyPlugin()],
  emitNewSongOnly: true
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'play') {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join voice channel first!');
    distube.play(voiceChannel, args.join(" "), {
      member: message.member,
      textChannel: message.channel,
    });
  }

  if (command === 'stop') {
    distube.stop(message);
    message.channel.send('Stopped music');
  }

  if (command === 'skip') {
    distube.skip(message);
  }

  if (command === 'pause') {
    distube.pause(message);
  }

  if (command === 'resume') {
    distube.resume(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
