const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const bot = new Discord.Client();


const config = require("./config.json");
const ideas = require("./ideaGenList.json");
const youtube = new YouTube(config.gkey);

var servers = {};

//this was needed cause my install of node js was borked
Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});

String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return (this.length > n) ? this.substr(0, n-1) + "...": this;
      };

//random number with min and max (setup to be used with arrarys)
function rNum(f,z) {
	var x = Math.floor((Math.random() * (z-1)) + f);
	return x;
}

//a simple check if a string has a word or multiple words (returns true or false)
String.prototype.has = String.prototype.has ||
	function(str){
		if(typeof str == "object"){
			for(var x = 0; x <= str.length; x++){
				if(this.search(str[x]) == -1){return false};
			}
			return true;
		}else if(this.search(str) == -1){return false}else{return true};
	};

function nickCheck(x, z) {
	if(x == null){
		return z;
	}else {
		return x;
	}
}

bot.on('ready', () => {
	console.log(config.bootmessage);
});

bot.on('message', message => {

	let args = message.content.substring(config.prefix.length).split(" ");
	let fullarg = message.content.substring(config.prefix.length).replace(/^.+? /, '');

  //checking if the message is coming from itself (prevents the bot from just responding to itself constantly)
	if (message.author.equals(bot.user)) { return
	}else if(!message.content.startsWith(config.prefix)){
    //if the message is just something stupid, just delete it
		var lowmsg = message.content.toLowerCase();
		if(lowmsg.has("sigma balls") || lowmsg.has("sigmaballs")){
			message.delete();
			return;
		}
    //whole bunch of checks just for sigma to interact with certain messages, needs to be cleaned up, wasn't originally gonna be this large
		if(lowmsg.has(["sigma", "bad"]) && !lowmsg.has("joke") && !lowmsg.has("not") && !lowmsg.has("isn't") && !lowmsg.has(["is","not"])) {
			var response = [": (", ";-;", "ah ;-;", "oh.. ok then."];
			message.channel.send(response[rNum(1, response.length)]);
			return;
		}
		if(lowmsg.has(["sigma", "good"]) || lowmsg.has(["sigma", "cool"]) || lowmsg.has(["sigma","best"])) {
			var response = ["I'm kind of a big deal", ":sunglasses:", ":thumbsup:", "I'm just the best"];
			message.channel.send(response[rNum(1, response.length)]);
			return;
		}
		if((lowmsg.has(["sigma","betrayed","me"]) || lowmsg.has(["sigma","betray","me"])) && (lowmsg.has("hasn't") || lowmsg.has(["has", "not"]) || lowmsg.has(["will", "not"]))) {
			var response = ["yet..", "are you sure about that?", "doesn't mean I won't", ":thinking:", ":eyes:"];
			message.channel.send(response[rNum(1, response.length)]);
			return;
		}
		if((lowmsg.has(["sigma","betrayed","me"]) || lowmsg.has(["sigma","betray","me"])) && (!lowmsg.has("hasn't") && !lowmsg.has(["has", "not"]))) {
			var response = ["good.", "you know I had to do it to ya", "ok and?", "so?", "I'd rather die standing than live kneeling."];
			message.channel.send(response[rNum(1, response.length)]);
			return;
		}
		if(lowmsg.has("uwu") || lowmsg.has("owo") || lowmsg.has("úwù") || lowmsg.has("-w-")) {
			var response = ["OwO", "UwU", "uwu", "owo", "-w-", "úwù","👁w👁"];
			message.channel.send(response[rNum(1, response.length)]);
			return;
		}
		if(lowmsg.has(["bad","joke"])) {
			var response = ["just cause you didn't find it funny :/", "k.", "you do better then"];
			message.channel.send(response[rNum(1, response.length)]);
			return;
		}
		return;
	}
  //actual commands, first one would active if you typed ">.joke" in chat or whatever prefix plus the word
	switch (args[0].toLowerCase()) {
		case 'joke' :
			var jokebank = ["me :clown:",
			"society :clown:",
			"if you do 1 + 1 it equals window.",
			"so the integer says to the if statement: \n undefined",
			"other than being right or wrong, you can also be left",
			"According to all known laws of aviation, there is no way a bee should be able to fly.",
			"did you know that reading a joke that a bot was programmed to say is not really ever funny? Good thing I'm not programmed to say that right?",
			"hahaha water make spark go boom",
			"haha funni",
			"Hogarth is a bullshit lord of the rings name, or so James tells me anyways. Who's James? dunno, it just says that on the joke card",
			"it may be difficult to believe but one of the many forms of entertainment known to humans that can immediately alleviate stress happens to be a vhs recording of the film 'space jam'.",
			"if you truly wanted to hear a joke, did you really think asking me for one would be the best choice?",
			"so here's how this will go: I'll say a random combination of characters and you will respond with laughter or a message expressing it. Ready? \n . \n **S̶̡͙͍̦͕͎̦͙͙̩̃̐ͩ̇͞͠I̍̆̀͌͝͏̺̮̠͚̖͚͖̮͍M͗͋͐ͥ̔ͮ͠͏̧̛̟̗̺̣ͅP̶̠̗̙͎̦̦̫̤̙̠̲̥̽̀͋͗͛̀̀͟͠**",
			"yes",
			"you. :hand_splayed:"];
			message.channel.send(jokebank[rNum(1, jokebank.length)]);
		break;
    //a drawing idea generator I made, but adapted into a single command
    //displays as a fancy rich embed (uses an external json file as a bank of everything)
		case 'ig':
		case 'igen':
		case 'ideagen' :
		case 'drawgen' :
		case 'ideas' :
		case 'drawideas' :
      //also using the role color of the bot for the discord embed
			var embed = new Discord.MessageEmbed().setColor(message.guild.me.displayHexColor)
				.setTitle("Drawing Idea Generator")
				.setDescription("Fun little concepts to draw or use for inspiration");
      //gave the option for the generator to have one more parameter to make it generate
      //a drawing idea for an object head
			switch(args[1].toLocaleLowerCase()) {
				case 'nsfw':
					var descA = ideas.desc.sfw.concat(ideas.desc.nsfw),
					typeA = ideas.type.sfw.concat(ideas.type.nsfw),
					jobA = ideas.job.sfw.concat(ideas.job.nsfw);
					message.channel.send(
						embed.addFields(
							{name: "Description", value: descA[rNum(1,descA.length)], inline: true},
							{name: "Type", value: typeA[rNum(1,typeA.length)], inline: true},
							{name: "Job", value: jobA[rNum(1,jobA.length)], inline: true}
						)
					);
				break;
				case 'head':
				case 'objecthead':
				case 'object':
				case 'oh':
				case 'ohead':
				case 'objecth':
					message.channel.send(
						embed.addFields(
							{name: "Description", value: ideas.desc.sfw[rNum(1,ideas.desc.sfw.length)], inline: true},
							{name: "Type", value: ideas.type.object[rNum(1,ideas.type.sfw.length)] + " Head", inline: true},
							{name: "Job", value: ideas.job.sfw[rNum(1,ideas.job.sfw.length)], inline: true}
						)
					);
				break;
				default:
					message.channel.send(
						embed.addFields(
							{name: "Description", value: ideas.desc.sfw[rNum(1,ideas.desc.sfw.length)], inline: true},
							{name: "Type", value: ideas.type.sfw[rNum(1,ideas.type.sfw.length)], inline: true},
							{name: "Job", value: ideas.job.sfw[rNum(1,ideas.job.sfw.length)], inline: true}
						)
					);
			};
		break;
    //get the user's profile picture and display it in chat
		case 'pfp':
			var pfpattachment = new Discord.MessageAttachment(message.member.user.avatarURL());
			message.channel.send(`This is what your cool profile picture looks like ${message.member}!`, pfpattachment);
		break;
    //give a new user a set role (currently only designed for one specific server)
		case 'accept':
			let memberRole = message.guild.roles.resolve(config.defaultRole);
			if (message.member.roles.member._roles[0] == undefined) {
				message.channel.send(`Welcome to the server ${message.member}! Please enjoy your stay!`);
				message.member.roles.add(memberRole);
			} else {
				message.channel.send("You are already part of the server..");
			};
		break;
    //user types in pog, bot outputs a random image of "poggers"
		case 'pog':
		case 'pogchamp':
		case 'poggers':
			var possible = ["https://i.imgur.com/vUGCiNP.png",
				'https://i.imgur.com/8sk3wGW.png',
				'https://i.imgur.com/5jaS6lW.png',
				'https://i.imgur.com/0LBL3GW.png',
				'https://i.imgur.com/GjTsnF4.png',
				'https://i.imgur.com/AgKFcIQ.png',
				'https://i.imgur.com/HW1TXn4.png'
			];
			var attachment = new Discord.MessageAttachment(possible[rNum(1,possible.length)]);
			message.channel.send(attachment);
		break;

		case 'ping':
			message.channel.send("pong!");
		break;
    //return "<user> told me to say: <message>"
		case 'parrot':
			message.delete();
			message.channel.send(`**${message.member} told me to say:** ` + fullarg);
		break;
    //music player
		case 'p':
		case 'play':
			function play(connection, message) {
				var server = servers[message.guild.id];
        //check if the server has the bot playing, and if it doesn't, connect and add the requested song to the queue
        //set the volume based on a user set volume and set server.playing to true
				if (server.playing == false) {
					server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));
					server.dispatcher.setVolumeLogarithmic(server.volume / 200);
					server.playing = true;

          //when the song finishes, set server.playing to false so we know that no music is Playing
          //check if there are more songs in the queue, and also check if loop is set to true by the user
					server.dispatcher.on("finish", function () {
						server.playing = false;
						if (server.queue.length > 1) {
							if (server.loop == true) {
                //if loop is true, rotate the queue so the first song is now the last
								server.queue.push(server.queue.shift());
							} else {
                //if not, just remove the currently finished song from the queue
								server.queue.shift();
							}
              //then play the next song
							play(connection, message);
              //this code below is probably leftovers, I'll have to test to double check but it looks useless
						} else if (server.loop == true) {
							play(connection, message);

						} else {
              //if the queue is empty, just disconnect
							server.queue = [];
							message.member.voice.channel.leave();
						}
					});
          //get the info of the song being played, and input that info obtained into a fancy richembed
          // the embed displays the thumbnail, name, description and channel
					ytdl.getInfo(server.queue[0]).then(result => {
						var embed = new Discord.MessageEmbed().setColor(message.guild.me.displayHexColor)
							.setFooter(nickCheck(message.guild.me.nickname, message.guild.me.user.username),message.guild.me.user.avatarURL())
							.setTitle(result.title)
							.setAuthor(result.author.name,result.author.avatar)
							.setURL(server.queue[0])
							.setThumbnail(result.player_response.videoDetails.thumbnail.thumbnails[0].url)
							.addField('Description', result.player_response.videoDetails.shortDescription.trunc(150));
						message.channel.send("**Now Playing:**", embed);
					}).catch(console.log);
				};
			};
      //if the command is called with no song requested, just display this message
			if (!args[1]) {
				message.channel.send("Please give me something to work with here...");
				return;
			};
      //if a user is not in a voice channel
			if (!message.member.voice.channel) {
				message.channel.send("Ya gotta be in a voice channel");
				return;
			};
      //settings for the current server
			if (!servers[message.guild.id]) {
				servers[message.guild.id] = { queue: [], volume: 100, playing: false, loop: false };
			};
      //list of servers
			var server = servers[message.guild.id];
      //join the voice channel and then get the song from a youtube link
			if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function (connection) {
				var embed = new Discord.MessageEmbed().setColor(message.guild.me.displayHexColor)
							.setFooter(nickCheck(message.member.nickname, message.member.user.username),message.member.user.avatarURL());
				if (fullarg.startsWith("https://youtu") || fullarg.startsWith("http://youtu") || fullarg.startsWith("https://www.youtu") || fullarg.startsWith("http://www.youtu")) {
					message.delete();
					server.queue.push(args[1]);
					play(connection, message);
					ytdl.getInfo(args[1]).then(result => {
						message.channel.send("**Added to queue:**",
							embed.setTitle(result.title)
							.setURL(args[1])
							.setThumbnail(result.player_response.videoDetails.thumbnail.thumbnails[0].url)
						);
					}).catch(console.log);
				} else if (fullarg.startsWith("https://") || fullarg.startsWith("http://")) {
          //if the message is a link but isn't a youtube one
					message.channel.send("Please send a youtube link or something you want me to search for");
				} else {
          //otherwise search for the song on youtube and get the first result
          //adding it to the queue
					youtube.searchVideos(fullarg, 1).then(result => {
						var full = "https://youtube.com/watch?v=" + result[0].id;
						server.queue.push(full);
						play(connection, message);
            //get the info of the video and display that on a richembed
						ytdl.getInfo(full).then(result => {
							message.delete();
							message.channel.send("**Added to queue:**",
								embed.setTitle(result.title)
								.setURL(full)
								.setThumbnail(result.player_response.videoDetails.thumbnail.thumbnails[3].url)
							);
						});
					}).catch()
				}
			});

		break;
    //if you try to set the volume with no number, give an error message
		case 'vol':
		case 'volume':
			if (!args[1]) {
				message.channel.send("Please give me something to work with here...");
				return;
			};
      //set these values below to stop the bot from breaking from undeclared variables
			if (!message.member.voice.channel) {
				message.channel.send("Ya gotta be in a voice channel");
				return;
			};

			if (!servers[message.guild.id]) {
				servers[message.guild.id] = { queue: [], volume: 100, playing: false, loop: false };
			};
      //if it's possible, then set the volume but the bot has to be playing something first
			var server = servers[message.guild.id];
			if (server.dispatcher && server.volume && Number(args[1]) > 0 && Number(args[1]) <= 100) {
				server.volume = Number(args[1]);
				server.dispatcher.setVolumeLogarithmic(server.volume / 200);
				message.channel.send("Set the volume to " + args[1] + "%");
      //return error messages if the user goes over 100 or below 1, or if they try to set the volume to something like a letter
			} else if (Number(args[1]) <= 0 || Number(args[1]) > 100) {
				message.channel.send("Volume only goes from 1% to 100%, apologies for that");
			} else if (Number(args[1])) {
				message.channel.send("Try playing something first please");
			} else {
				message.channel.send("Okay so you know what you put right there? I do not understand a word of it.");
			}
			break;
    //make the bot loop music
		case 'loop':
			if (!message.member.voice.channel) {
				message.channel.send("Ya gotta be in a voice channel");
				return;
			};

			if (!servers[message.guild.id]) {
				servers[message.guild.id] = { queue: [], volume: 100, playing: false, loop: false };
			};

			var server = servers[message.guild.id];
      //toggle loop
			if (server.loop == false) { server.loop = true; } else { server.loop = false };
			message.channel.send("Set looping to " + server.loop);
		break;

		case 'skip':
			if (!message.member.voice.channel) {
				message.channel.send("Ya gotta be in a voice channel");
				return;
			};

			if (!servers[message.guild.id]) {
				servers[message.guild.id] = { queue: [], volume: 100, playing: false, loop: false };
			};

			var server = servers[message.guild.id];
      //end the current song and go to the next
			if (server.dispatcher) { server.playing = false; server.dispatcher.end(); }
			message.channel.send("Skipped the current track");
		break;

		case 'stop':
			if (!message.member.voice.channel) {
				message.channel.send("Ya gotta be in a voice channel");
				return;
			};

			if (!servers[message.guild.id]) {
				servers[message.guild.id] = { queue: [], volume: 100, playing: false, loop: false };
			};

			var server = servers[message.guild.id];
      //empty the queue and end the current song
			server.queue = [];
			server.playing = false;
			message.member.voice.channel.leave();
			message.channel.send("Ended the queue");
		break;
	}
});

bot.login(config.token);
