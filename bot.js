const data = require('./data.json');

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
const coms = new Discord.Collection();

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
    const input = message.content.slice(data.PREFIX.length).split(' ');
    const command = input.shift().toLowerCase();
    const args = input;

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
