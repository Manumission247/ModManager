const { readdirSync, lstatSync } = require("fs");
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../botconfig/config.json");
const dirSetup = [{
	"Folder": "Info", "CmdName": "info",
	"CmdDescription": "Grant specific Information about something!"
}, {
	"Folder": "Settings", "CmdName": "settings",
	"CmdDescription": "Adjust the Settings of the Bot!"
}, {
	"Folder": "Music", "CmdName": "music",
	"CmdDescription": "Playing/Queuing Music"
}, {
	"Folder": "Points", "CmdName": "points",
	"CmdDescription": "Points System"
}, {
	"Folder": "Fun", "CmdName": "Fun",
	"CmdDescription": "Games and Fun Commands"
}, {
	"Folder": "Queue", "CmdName": "queue",
	"CmdDescription": "Queue Commands"
}, {
	"Folder": "Song", "CmdName": "song",
	"CmdDescription": "Song specific Commands"
}, {
	"Folder": "Filter", "CmdName": "filter",
	"CmdDescription": "Add Filters to your Music"
}, {
	"Folder": "Support", "CmdName": "support",
	"CmdDescription": "Suppot Desk Management"
}, {
	"Folder": "ReactionRoles", "CmdName": "reactionrole",
	"CmdDescription": "Manages Reaction Roles"
}];

module.exports = (client) => {
	try {
		let allCommands = [];
		readdirSync("./slashCommands/").forEach((dir) => {
			if (lstatSync(`./slashCommands/${dir}`).isDirectory()) {
				const groupName = dir;
				const cmdSetup = dirSetup.find(d => d.Folder == dir);
				//If its a valid cmdsetup
				if (cmdSetup && cmdSetup.Folder) {
					//Set the SubCommand as a Slash Builder
					const subCommand = new SlashCommandBuilder().setName(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase()).setDescription(String(cmdSetup.CmdDescription));
					//Now for each file in that subcommand, add a command!
					const slashCommands = readdirSync(`./slashCommands/${dir}/`).filter((file) => file.endsWith(".js"));
					for (let file of slashCommands) {
						let pull = require(`../slashCommands/${dir}/${file}`);
						if (pull.name && pull.description) {
							subCommand
								.addSubcommand((subcommand) => {
									subcommand.setName(String(pull.name).toLowerCase()).setDescription(pull.description)
									console.log(` Added Command: ${pull.name}`);
									if (pull.options && pull.options.length > 0) {
										for (const option of pull.options) {
											if (option.User && option.User.name && option.User.description) {
												subcommand.addUserOption((op) =>
													op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
												)
												console.log(` Added Option: ${option.User.name}`);
											} else if (option.Integer && option.Integer.name && option.Integer.description) {
												subcommand.addIntegerOption((op) =>
													op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
												)
												console.log(` Added Option: ${option.Integer.name}`);
											} else if (option.String && option.String.name && option.String.description) {
												subcommand.addStringOption((op) =>
													op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
												)
												console.log(` Added Option: ${option.String.name}`);
											} else if (option.Channel && option.Channel.name && option.Channel.description) {
												subcommand.addChannelOption((op) =>
													op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
												)
												console.log(` Added Option: ${option.Channel.name}`);
											} else if (option.Role && option.Role.name && option.Role.description) {
												subcommand.addRoleOption((op) =>
													op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
												)
												console.log(` Added Option: ${option.Role.name}`);
											} else if (option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0) {
												subcommand.addStringOption((op) =>
													op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
														.addChoices(option.StringChoices.choices.map(c => [String(c[0]).replace(/\s+/g, '_').toLowerCase(), String(c[1])])),
												)
												console.log(` Added Option: ${option.StringChoices.name}`);
											} else if (option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0) {
												subcommand.addStringOption((op) =>
													op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
														.addChoices(option.IntChoices.choices.map(c => [String(c[0]).replace(/\s+/g, '_').toLowerCase(), parseInt(c[1])])),
												)
												console.log(` Added Option: ${option.IntChoices.name}`);
											} else {
												console.log(`A Option is missing the Name or/and the Description of ${pull.name}`)
											}
										}
									}
									return subcommand;
								})
							client.slashCommands.set(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase() + pull.name, pull)
						} else {
							console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightRed);
							continue;
						}
					}
					//add the subcommand to the array
					allCommands.push(subCommand.toJSON());
				}
				else {
					return console.log(`The Subcommand-Folder ${dir} is not in the dirSetup Configuration!`);
				}
			} else {
				let pull = require(`../slashCommands/${dir}`);
				if (pull.name && pull.description) {
					let Command = new SlashCommandBuilder().setName(String(pull.name).toLowerCase()).setDescription(pull.description);
					console.log(` Added (else) Command: ${pull.name}`);
					if (pull.options && pull.options.length > 0) {
						for (const option of pull.options) {
							if (option.User && option.User.name && option.User.description) {
								Command.addUserOption((op) =>
									op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
								)
							} else if (option.Integer && option.Integer.name && option.Integer.description) {
								Command.addIntegerOption((op) =>
									op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
								)
							} else if (option.String && option.String.name && option.String.description) {
								Command.addStringOption((op) =>
									op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
								)
							} else if (option.Channel && option.Channel.name && option.Channel.description) {
								Command.addChannelOption((op) =>
									op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
								)
							} else if (option.Role && option.Role.name && option.Role.description) {
								Command.addRoleOption((op) =>
									op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
								)
							} else if (option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0) {
								Command.addStringOption((op) =>
									op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
										.addChoices(option.StringChoices.choices.map(c => [String(c[0]).replace(/\s+/g, '_').toLowerCase(), String(c[1])])),
								)
							} else if (option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0) {
								Command.addStringOption((op) =>
									op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
										.addChoices(option.IntChoices.choices.map(c => [String(c[0]).replace(/\s+/g, '_').toLowerCase(), parseInt(c[1])])),
								)
							} else {
								console.log(`A Option is missing the Name or/and the Description of ${pull.name}`)
							}
						}
					}
					allCommands.push(Command.toJSON());
					client.slashCommands.set("normal" + pull.name, pull)
				}
				else {
					console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightRed);
				}
			}
		});

		//Once the Bot is ready, add all Slas Commands to each guild
		client.on("ready", () => {
			if (config.loadSlashsGlobal) {
				console.log(` Adding Commands GLOBALLLY`);
				client.application.commands.set(allCommands)
					.then(slashCommandsData => {
						client.slashCommandsData = slashCommandsData;
						console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for all: ${`All possible Guilds`.underline}`.brightGreen);
						console.log(`Because u are Using Global Settings, it can take up to 1 hour until the Commands are changed!`.bold.yellow)
					}).catch((e) => { console.log(String(e).white) });
			} else {
				console.log(` Adding Commands PER GUILD`);
				client.guilds.cache.map(g => g).forEach(async (guild) => {
					try {
						///await guild.commands.set([]).catch((e) => { console.log(String(e).white) }); - CAUSES ISSUES WITH API ISSUES.
						guild.commands.set(allCommands)
							.then(slashCommandsData => {
								client.slashCommandsData = slashCommandsData;
								console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen);
							}).catch((e) => { console.log(` ERROR: ADDING COMMANDS ${String(e).white}`) });
					} catch (e) {
						console.log(` ERROR: ADDING COMMANDS ${String(e).white}`)
					}
				});
			}
		})
		//DISABLE WHEN USING GLOBAL!
		client.on("guildCreate", async (guild) => {
			try {
				if (!config.loadSlashsGlobal) {
					//await guild.commands.set([]).catch((e) => { console.log(String(e).white) }); - - CAUSES ISSUES WITH API ISSUES.
					guild.commands.set(allCommands)
						.then(slashCommandsData => {
							console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen);
						}).catch((e) => { console.log(String(e).white) });
				}
			} catch (e) {
				console.log(String(e).white)
			}
		})

	} catch (e) {
		console.log(String(e.stack).bgRed)
	}
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
