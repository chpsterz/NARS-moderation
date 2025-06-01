const { InteractionContextType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearallstrikes')
		.setDescription('Clears all the strikes for every user')
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		const embeds = [];


		const member = await interaction.guild.members.fetch(interaction.user.id);

		if (await member.roles.cache.has('1373344496548450334')) {
		// Read the current file
			fs.readFile('strikes.json', 'utf8', (err, data) => {
				if (err) {
					console.error('Error reading file:', err);
					return;
				}

				try {
					const json = JSON.parse(data);

					json.strikes = [];

					// Write updated data back to file
					fs.writeFile('strikes.json', JSON.stringify(json, null, 2), (err) => {
						if (err) {
							console.error('Error writing file:', err);
						}
					});
				}
				catch (e) {
					console.error('Error parsing JSON:', e);
				}
			});

			const successEmbed = new EmbedBuilder()
				.setColor(0x61cd2a)
			// ADD LATER: actually @ the person so they know they got striked
				.setTitle('All strikes have been cleared')
				.setDescription('All records of strikes have been cleared')
				.setTimestamp()
				.setFooter({ text: 'NARS Moderation', iconURL: 'https://cdn.discordapp.com/icons/1282262872675844106/fd63e5c9b231c482ec3a9bce40135a01.png?size=4096' });
			embeds.push(successEmbed);

			await interaction.reply({ embeds });
		}
		else {
			const strikeEmbed = new EmbedBuilder()
				.setColor(0xff0000)
			// ADD LATER: actually @ the person so they know they got striked
				.setTitle('You do not have permission to run this command')
				.setTimestamp()
				.setFooter({ text: 'NARS Moderation', iconURL: 'https://cdn.discordapp.com/icons/1282262872675844106/fd63e5c9b231c482ec3a9bce40135a01.png?size=4096' });

			await interaction.reply({ embeds: [ strikeEmbed ] });
		}
	},
};