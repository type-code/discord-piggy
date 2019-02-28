const config = require("./config.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const colors = require("colors");

var last_online = [];
//last_online.push({name: "qwe", date: new Date()});

bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.tag}!`.blue);
	bot.user.setStatus("online");
});
  
bot.on("message", msg => {
	// if (msg.content === "ping") {
	// 	console.log(msg.channel.type);
	// 	//msg.reply("hyi sosi");
	// }

	if (!msg.content.startsWith("/")) return;
	var args = msg.content.split(" ")
	var cmd = args[0];
	var response = "";

	switch(cmd) {
		case "/last": {
			if (!args[1]) {
				response += "__           Last online on server:           __\n";
				for(var user of last_online) {
					var name = user.name;
					var date = parseTime(user.date);
					response += `**${name}:**\t${date}\n`;
				}
			}
			else {
				for(var user of last_online) {
					if (user.name == args[1]) {
						var name = user.name;
						var date = parseTime(user.date);
						response += `**${name}:**\t${date}\n`;
						break;
					}
				}
			}
			msg.channel.send(response);
			break;
		}
	}

	msg.delete(5);
});

bot.on("presenceUpdate", (old, updated) => {
	var old_status = old.presence.status;
	var status = updated.presence.status;
	var user = updated.nickname;
	var tag = updated.user.tag;

	if (old_status != status && (status == "online" || status == "offline")) {
		if (status == "online") status = status.green;
		if (status == "offline") {
			status = status.red;
			updateOnline(user, tag);
		}
		console.log(`${user} - ${status} - ` + new Date().toLocaleString());
	}
});

bot.on("disconnected", () => {
    bot.user.setStatus("offline");
    console.log(bot.user); //returns the current user
});

function updateOnline(name, tag) {
	var updated = false;
	for(var user of last_online) {
		if (user.tag == tag) {
			user.name = name;
			user.date = new Date();
			updated = true;
			break;
		}
	}

	if (!updated) {
		last_online.push({name, tag, date: new Date()});
	}

	last_online.sort(function(a, b) {
		return b.date.getTime() - a.date.getTime();
	});
}

function parseTime(time, full = true) {
	if (typeof time == "string") time = new Date(time);

	var day = zeroAdd(time.getDate());
	var month = zeroAdd(time.getMonth() + 1);
	var year = zeroAdd(time.getFullYear());

	var hours = zeroAdd(time.getHours());
	var minutes = zeroAdd(time.getMinutes());
	var seconds = zeroAdd(time.getSeconds());

	var parsed = `${day}.${month}.${year}`;
	if (full) parsed += ` - ${hours}:${minutes}:${seconds}`;

	return parsed;
}

function zeroAdd(number) {
	return (number > 9 ? number : "0" + number);
}

bot.login(config.api_token);