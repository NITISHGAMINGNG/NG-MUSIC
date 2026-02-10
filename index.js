const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client, {
  emitNewSongOnly: true,
  plugins: [new SpotifyPlugin()],
});

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "play") {
    if (!message.member.voice.channel)
      return message.reply("❌ Join a voice channel first!");

    distube.play(message.member.voice.channel, args.join(" "), {
      member: message.member,
      textChannel: message.channel,
    });
  }

  if (command === "stop") {
    distube.stop(message);
    message.channel.send("⏹ Stopped music.");
  }

  if (command === "skip") {
    distube.skip(message);
  }

  if (command === "pause") {
    distube.pause(message);
  }

  if (command === "resume") {
    distube.resume(message);
  }

  if (command === "queue") {
    const queue = distube.getQueue(message);
    if (!queue) return message.channel.send("No songs in queue.");
    message.channel.send(
      queue.songs
        .map((song, id) => `${id + 1}. ${song.name} - ${song.formattedDuration}`)
        .join("\n")
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
