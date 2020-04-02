const data = require('./data.json');

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
const coms = new Discord.Collection();

var checkUpdate = require('check-update-github');
var pkg = require('./package.json');

client.on('ready', () => {
	checkUpdate({
	    name: pkg.name,
	    currentVersion: pkg.version,
	    user: 'Erdioner',
	    branch: 'master'
	    }, function(err, latestVersion, defaultMessage){
	    if(!err){
	        console.log(defaultMessage);
					if (latestVersion != pkg.version && data.NormalChannelId != '') {
						client.channels.fetch(data.NormalChannelId).then((channel) => {
							channel.send("The latest version of Scrible is not equal the one used! Current: "+pkg.version+" | Latest: "+latestVersion)
						}).catch(console.error);
					}
	    }
	});
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	coms.set(command.name, command);
}

const Scrible = require('./models/scrible.js')
const mongoose = require('mongoose');
mongoose.connect(data.ConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'database error:'));
db.once('open', function() {
  console.log('Connected to database');
});

Scrible.countDocuments({ tag: 'CustomWords' }, (err, count) => {
  if (count == 0) {
    Scrible.create({data: '', tag: 'CustomWords'}, (err, model) => {
      if (err) return handleError(err);
    })
  }
})

client.once('ready', () => {
	console.log('Bot is online');
});

client.on('message', (message) => {
	if (message.content.startsWith(data.PREFIX)) {
    const input = message.content.toLowerCase().slice(data.PREFIX.length).split(' ');
    const command = input.shift().toLowerCase();
    const args = input;

		for (var i = 0; i < args.length; i++) {
			if (args[i].startsWith('"')) {
				for (var j = 0; j < args.length; j++) {
					if (args[j].endsWith('"')) {
						break;
					}
				}
				temp = args.splice(i, j-i+1);
				temp2 = '';
				for (var k = 0; k < temp.length; k++) {
					temp[k] = temp[k].replace(/["]+/g, '');
					if (k < temp.length-1) {
						temp2 += temp[k] + ' ';
					} else { temp2 += temp[k]; }
				}
				args.push(temp2);

			}
		}

		if (command == 'help' || command == 'h') {
			temp = '>?{Command & Usage} | {Description}\n'
			coms.every( (com) => {
				try {
					temp += '>'+ com.usage + ' | ' + com.description + '\n';
				} catch { return com == com; }
				return com == com;
			});
			message.channel.send(temp);
			message.delete();
		}

    if (command != 'h' && command != 'help' && coms.find( (com) => { return com.name == command; }) == undefined) {
      message.channel.send('No command named "' + command+'"').then((msg) => {msg.delete({ timeout:5000 })});
			if (message.deletable) {
        message.delete();
      }
    } else if (command != 'h' && command != 'help') {
      coms.get(command).execute(message, args);
    }
  }
});

client.login(data.TOKEN);
