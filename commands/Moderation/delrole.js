const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "delrole", //the command name for the Slash Command
    category: "Moderation",
    usage: "delrole [member] [role]",
    aliases: [],
    description: "Remove's a role to a user.", //the command description for Slash Command Overview
    cooldown: 15,
    memberpermissions: ["MANAGE_MEMBERS"],
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        client.features.ensure(message.guild.id, {
            music: true,
            logs: true,
            reactionroles: true,
            moderation: true,
            fun: true,
            youtube: false,
            support: true,
            points: true,
        });
        if (client.features.get(message.guild.id, "moderation") == false) {
            return;
        } else {
            try {
                let member = message.mentions.users.first();
                let role = message.guild.roles.cache.get("RoleID");

                await member.roles.remove(role)
                message.reply(`<@${member}> has had the role <@${role}> added`)

            } catch (e) {
                const { logMessage } = require(`../../handlers/newfunctions`);
                logMessage(client, `error`, message.guild, `Error with DELROLE command: ${e.message} | \`\`\` ${e.stack} \`\`\``);
            }
        }
    }
};