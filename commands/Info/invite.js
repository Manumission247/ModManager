const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "invite", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Info",
  usage: "invite",
  aliases: ["inviteme", "addme",],

  cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Sends you an invite link", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`[**Click here to invite me!**](https://discord.com/api/oauth2/authorize?client_id=714939771935522838&permissions=395471617271&redirect_uri=http%3A%2F%2Fmodmanager.manumission247.co.uk%3A38455%2Fcallback&scope=bot%20applications.commands)\n\n||[**Click here to invite me __without__ Slash Commands!**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)||`)
        ]
      });
    } catch (e) {
      const { logMessage } = require(`../../handlers/newfunctions`);
      logMessage(client, `error`, message.guild, `Error with INVITE command: ${e.message} | \`\`\` ${e.stack} \`\`\``);
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
