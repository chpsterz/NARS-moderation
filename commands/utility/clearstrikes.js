const { InteractionContextType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearstrikes')
		.setDescription('Clears all the strikes from a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('selects user to be cleared').setRequired(true))
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		const person = interaction.options.getUser('user');

		const embeds = [];

		// Read the current file
		fs.readFile('strikes.json', 'utf8', (err, data) => {
			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			try {
				const json = JSON.parse(data);

				for (let i = 0; i < json.strikes.length; i++) {
					if (json.strikes[i].user.id == person.id) {
						json.strikes.splice(i, 1);
						i = i - 1;
					}
				}

				// Write updated data back to file
				fs.writeFile('strikes.json', JSON.stringify(json, null, 2), (err) => {
					if (err) {
						console.error('Error writing file:', err);
					}
					else {
						const successEmbed = new EmbedBuilder()
							.setColor(0x0099FF)
						// ADD LATER: actually @ the person so they know they got striked
							.setTitle(`${person.username}'s strikes have been cleared`)
							.setDescription(`<@${person.id}>'s strikes have been cleared by <@${interaction.user.id}>`)
							.setTimestamp()
							.setFooter({ text: 'NARS Moderation', iconURL: 'https://cdn.discordapp.com/icons/1282262872675844106/fd63e5c9b231c482ec3a9bce40135a01.png?size=4096' });
						embeds.push(successEmbed);
						interaction.channel.send({ embeds });
					}
				});
			}
			catch (e) {
				console.error('Error parsing JSON:', e);
			}
		});
	},
};