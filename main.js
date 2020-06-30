// Loads required libraries 
const Discord = require('discord.js');

// Creates the bot as a constant
const client = new Discord.Client();

// Loads token and prefix
const config = require('./config.json');

client.on('ready', () => {
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	// Changes the bot's playing game to something useful
	// WATCHING can be changed to LISTENING, PLAYING, STREAMING, CUSTOM_STATUS
	client.user.setActivity(`${client.guilds.size} servers`, {type: "WATCHING"});
});

client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	// Changes the bot's playing game to something useful
	// WATCHING can be changed to LISTENING, PLAYING, STREAMING, CUSTOM_STATUS
	client.user.setActivity(`${client.guilds.size} servers`, {type: "WATCHING"});
});

 client.on("guildDelete", guild => {
	// This event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	// Changes the bot's playing game to something useful
	// WATCHING can be changed to LISTENING, PLAYING, STREAMING, CUSTOM_STATUS
	client.user.setActivity(`${client.guilds.size} servers`, {type: "WATCHING"});
 });

client.on("message", async message => {
	// Ignore all other bots
	if(message.author.bot) return;
	
	// Ignore commands missing prefix
	if(!message.content.startsWith(config.prefix)) return;
	
	// Separate command name from arguments
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const help = args.shift().toLowerCase()

	// Help commands, these are case sensitive
	if(command === "help") {
		if(help == "ping") {
			message.channel.send("Use the .ping command to check how long it takes me to reply.")
		} else if(help == "echo") {
			message.channel.send("Use the .echo command to make me say something in a channel. Don't worry, I'll delete your message first. Only administrators and channel managers can use this command.")
		} else if(help == "purge") {
			message.channel.send("Use the .purge command to remove between 2 and 100 messages in a channel. Only @Admin and @ Moderator can use this command.")
		} else if(help == "donate") {
			message.channel.send("Use the .donate command to check how long it takes me to replyget a link to my PayPal.me page.")
		} else {
			message.channel.send("I'm not sure what you need help with...")
		}
	}


	// Calculate ping
	if(command === "ping") {
	  const m = await message.channel.send("Ping?");
	  m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
	}

	// Echo input
	if(command === "echo") {
		// Only people with administrative and channel management permissions can use this command
		// As an alternative you could use roles:
		// if(!message.member.roles.some(r=>["Admin", "Moderator"].includes(r.name)) )
		if(!message.member.hasPermission(r=>['ADMINISTRATOR', 'MANAGE_CHANNELS'].includes(r.name)) )
			return message.reply("Sorry, only administrators and channel managers have permissions to use this!")
		
		const sayMessage = args.join(" ");

		// Deletes command message
		message.delete().catch(O_o=>{});

		// Sends message
		message.channel.send(sayMessage);
	}

	// Remove messages from a channel (up to 100)
	if(command === "purge") {
		// Only people with the role "Admin" or "Moderator" can use this command
		// As an alternative you could use permissions:
		// if(!message.member.hasPermission(r=>['ADMINISTRATOR', 'MANAGE_CHANNELS'].includes(r.name)) )
		if(!message.member.roles.some(r=>["Admin", "Moderator"].includes(r.name)) )
			return message.reply("Sorry, only @Admin and @Moderator have permissions to use this!")
		
		const deleteCount = parseInt(args[0], 10);
		
		// Deletes command message
		message.delete().catch(O_o=>{})

		// Error message if no number, or the wrong number is entered
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
			return message.reply("Please provide a number between 2 and 100 for the number of messages to delete.");
		
		// Get our messages and delete them
		const fetched = await message.channel.fetchMessages({limit: deleteCount});

		// Error message if the messages could not be deleted
		message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	}

	// Sends a donation link
	if(command === "donate") {
		// Deletes command message
		message.delete().catch(O_o=>{})
		message.channel.send("You can donate to the bit developer here ####URL HERE####")
	}

});

client.login(config.botToken);
