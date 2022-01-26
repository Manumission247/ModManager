const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, newMessage, message) => {
	//console.log(message);
	if (message.bot) { return }
	client.settings.ensure(message.guild.id, {
		prefix: config.prefix,
		defaultvolume: 50,
		defaultautoplay: false,
		defaultfilters: [`bassboost6`, `clear`],
		djroles: [],
		botchannel: [],
		logxhannel: [],
	})

	//console.log(`pin updated in ${channel.guild.id}`);
	//console.log(settings.modLogChannel);
	if (message.guild.channels.cache.find(c => c.id == client.settings.get(message.guild.id, "logchannel"))) {
		if(message.author.bot) { return; }
		if(newMessage.author.bot) { return; }
		
		/*
			Create an EMBED for the message to send to the log channel as defined in Bot Settings for the guild.
		*/
		//console.log(`Message Edit Log Enabled`);
		if (message.lastPinTimestamp == '0' || message.lastPinTimestamp == null) {
			var pinned = false
		} else {
			var pinned = true
		}
		const embed = new Discord.MessageEmbed()
			.setAuthor(`Modlogs`, newMessage.guild.iconURL())
			.setColor("#ff0000")
			.setFooter(newMessage.guild.name, newMessage.guild.iconURL())
			.setTitle("**Moderation** - Message Edited")
			.addField('Author', `<@${message.author.id}>`, true)
			.addField('Channel', newMessage.channel.name, true)
			.addField('Pinned Recently?:', `> ${pinned}`, true)
			.addField('New Message:', `> ${message.content}`)
			.addField('Old Message:', `> ${newMessage.content}`)
			.setColor('0x00AAFF')
			.setTimestamp();
		// Send the message to the Mod Log Channel


		message.guild.channels.cache.find(c => c.id == client.settings.get(message.guild.id, "logchannel")).send({ embeds: [embed] });
		client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: messageUpdate Successfully`);
		//client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageUpdate Successfully`);
	}
	//Logging Disabled do nothing.

};