const { InteractionContextType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('liststrikes')
		.setDescription('Lists all the strikes for a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('selects users strikes to be listed').setRequired(true))
		.setContexts(InteractionContextType.Guild),
	execute(interaction) {
		const person = interaction.options.getUser('user');

		// Read the current file
		fs.readFile('strikes.json', 'utf8', async (err, data) => {
			const strikesEmbed = new EmbedBuilder();

			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			try {
				const json = JSON.parse(data);

				let description = '';
				let count = 0;

				for (let i = 0; i < json.strikes.length; i++) {
					if (json.strikes[i].user.id == person.id) {
						description += `\n <@${json.strikes[i].striker}> striked <@${person.id}> for ${json.strikes[i].reason} \n`;
						count++;
					}
				}


		        let message = '';

				if (count == 2) {
					message = '1';
					description += `\n <@${person.id}> is currently banned for ${message} days`;
				}
				else if (count == 3) {
					message = '3';
					description += `\n <@${person.id}> is currently banned for ${message} days`;
				}
				else if (count == 4) {
					message = '5';
					description += `\n <@${person.id}> is currently banned for ${message} days`;
				}
				else if (count >= 5) {
					message = 'indefinite';
					description += `\n <@${person.id}> is currently banned for ${message} days`;
				}

				if (description.length == 0) {
					description = `<@${person.id}> has no strikes`;
				}

				strikesEmbed
					.setColor(0x000000)
				// ADD LATER: actually @ the person so they know they got striked
					.setTitle(`A list of ${person.username}'s strikes`)
					.setDescription(description)
					.setTimestamp()
					.setFooter({ text: 'NARS Moderation', iconURL: 'https://cdn.discordapp.com/icons/1282262872675844106/fd63e5c9b231c482ec3a9bce40135a01.png?size=4096' });

				strikesEmbed.setDescription(description);

				// interaction.channel.send({ embeds: [strikesEmbed] });


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
			await interaction.reply({ embeds: [ strikesEmbed ] });
		});
	},
};