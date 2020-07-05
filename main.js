// Loads required linked files 
const Discord = require('discord.js');
const config = require('./config.json');

// Creates the bot as a constant
const client = new Discord.Client();

client.on('ready', () => {
	// This event triggers when the bot is live
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.\nLogged in as ${client.user.tag}`); 
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
	// This event triggers when the bot is removed from a server
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

	// Help commands are responded to as embeds
	if(command === "help") {
		// Allows the creation of rich embeds
		const embed = new Discord.RichEmbed();
		// Set embed footer
		embed.setFooter("Help files", "https://img.icons8.com/ios/50/000000/help.png");
		// Set embed colour
		embed.setColor("BLUE");
		// The first field is the Title, the second field is the Description
		if(args == "ping") {
			embed.addField(".ping", "Use this command to check how long it takes me to reply.");
			message.channel.send((embed));
		} else if(args == "echo") {
			embed.addField(".echo", "Use the this command to make me say something in a channel. Don't worry, I'll delete your message first.\n\nOnly administrators and channel managers can use this command.");
			message.channel.send((embed));
		} else if(args == "purge") {
			embed.addField(".purge", "Use this command to remove between 2 and 100 messages in a channel.\n\nOnly @Admin and @ Moderator can use this command.");
			message.channel.send((embed));
		} else if(args == "donate") {
			embed.addField(".donate", "Use this command to get a link to my PayPal.me page.");
			message.channel.send((embed));
		} else if(args == "serverinfo") {
			embed.addField(".serverinfo", "Use this command to get information about the server.\n\nOnly @Admin and @ Moderator can use this command.");
			message.channel.send((embed));
		} else {
			embed.addField("You didn't tell me what you need help with, please try:", "`ping`, `echo`, `purge`, `donate`, or `serverinfo`.");
			message.channel.send((embed));
		}
		// Deletes command message
		message.delete().catch(O_o=>{});
	}


	// Calculate ping
	if(command === "ping") {
	  const m = await message.channel.send("Ping?");
	  m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp} ms. API Latency is ${Math.round(client.ping)} ms.`);
	}

	// Echo input
	if(command === "echo") {
		// Allows the creation of rich embeds
		const embed = new Discord.RichEmbed();
		// Only people with administrative and channel management permissions can use this command
		// As an alternative you could use roles:
		// if(!message.member.roles.some(r=>["Admin", "Moderator"].includes(r.name)) )
		if(!message.member.hasPermission(r=>['ADMINISTRATOR', 'MANAGE_CHANNELS'].includes(r.name)) )
			return message.reply("\n***Error 401***\nSorry, only administrators and channel managers have permissions to use this!")
		const sayMessage = args.join(" ");
		// Deletes command message
		message.delete().catch(O_o=>{});
		// Sends as a message, uncomment (remove //) to activate
		//message.channel.send(sayMessage);
		// Sends as an embed, remove these lines or comment them out if you are sending as a normal message above
		embed.setColor("GREY");
		embed.setDescription(sayMessage)
		message.channel.send((embed))
	}

	// Remove messages from a channel (up to 100)
	if(command === "purge") {
		// Only people with the role "Admin" or "Moderator" can use this command
		// As an alternative you could use permissions:
		// if(!message.member.hasPermission(r=>['ADMINISTRATOR', 'MANAGE_CHANNELS'].includes(r.name)) )
		if(!message.member.roles.some(r=>["Admin", "Moderator"].includes(r.name)) )
			return message.reply("\n***Error 401***\nSorry, only @Admin and @Moderator have permissions to use this!")
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
		message.channel.send("You can donate to ######## here ########")
	}

	// Server information is sent as a rich embed
	if(command === "serverinfo") {
		// Allows the creation of rich embeds
		const embed = new Discord.RichEmbed();
		// Only people with the role "Admin" or "Moderator" can use this command
		// As an alternative you could use permissions:
		// if(!message.member.hasPermission(r=>['ADMINISTRATOR', 'MANAGE_CHANNELS'].includes(r.name)) )
		if(!message.member.roles.some(r=>["Admin", "Moderator"].includes(r.name)) )
			return message.reply("\n***Error 401***\nSorry, only @Admin and @Moderator have permissions to use this!")
		// Set embed colour
		embed.setColor("GREEN");
		// Set embed thumbnail as the servers avatar
		embed.setThumbnail(message.guild.iconURL);
		// Set embed footer
		embed.setFooter("Server Info", "https://img.icons8.com/ios/50/000000/about.png")
		// Set embed title
		//embed.setTitle("Server Info");
		// The first field is the Title, the second field is the Description, initline allows the field to appear on the same line as the previous field
		embed.addField("Server name", message.guild.name, inline = true);
		embed.addField("Server Owner", message.guild.owner, inline = true);
		embed.addField("\u200B", "\u200B", inline = false); // Creates a blank line
		embed.addField("Members", message.guild.memberCount, inline = true);
		embed.addField("Online", message.guild.members.filter(m => m.presence.status === 'online').size, inline = true);
		embed.addField("Offline", message.guild.members.filter(m => m.presence.status === 'offline').size, inline = true);
		embed.addField("\u200B", "\u200B", inline = false); // Creates a blank line
		embed.addField("Server ID", message.guild.id, inline = false);
		embed.addField("Server created", message.guild.createdAt, inline = false);
		// Deletes command message
		message.delete().catch(O_o=>{});
		// Sends the embed
		message.channel.send((embed));
	}

});

// Logs the robot into Discord
client.login(config.botToken);
