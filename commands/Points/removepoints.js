const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);

module.exports = {
    name: "removepoints", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Points",
    aliases: ["rp"],
    usage: "removepoints <user> <points>",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Removes Points from a user", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_MESSAGES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        try {
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
        if (client.features.get(message.guild.id, "points") == false) {
            return;
        } else {
            client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
            client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
            let score;
            score = client.getScore.get(message.author.id, message.guild.id);
            if (!score) {
                score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
            }
            // Limited to guild owner - adjust to your own preference!
            //if (!message.author.id === message.guild.ownerId) return message.reply("You're not the boss of me, you can't do that!");

            const user = message.mentions.users.first() || client.users.cache.get(args[0]);
            if (!user) return message.reply("You must mention someone or give their ID!");

            const pointsToRemove = parseInt(args[1], 10);
            if (!pointsToRemove) return message.reply("You didn't tell me how many points to give...");

            // Get their current points.
            let userScore = client.getScore.get(user.id, message.guild.id);

            // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
            if (!userScore) {
                userScore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 }
            }
            userScore.points -= pointsToRemove;

            // We also want to update their level (but we won't notify them if it changes)
            let difficulty = 0.3;
            let serverdifficulty = client.settings.get(message.guild.id, `serverdifficulty`)
            if (serverdifficulty == "Hard") {
                difficulty = 0.1;
            }
            else if (serverdifficulty == "Medium" || serverdifficulty == "") {
                difficulty = 0.3;
            }
            else if (serverdifficulty == "Easy") {
                difficulty = 0.6;
            }

            let userLevel = Math.floor(difficulty * Math.sqrt(score.points));
            userScore.level = userLevel;

            // And we save it!
            client.setScore.run(userScore);

            return message.channel.send(`${user.tag} has had ${pointsToRemove} points removed and now stands at ${userScore.points} points.`);
        }
    } catch (e) {
        const { logMessage } = require(`../../handlers/newfunctions`);
        logMessage(client, `error`, message.guild, `Error with REMOVEPOINTS command: ${e.message} | \`\`\` ${e.stack} \`\`\``);
    }
    }
};