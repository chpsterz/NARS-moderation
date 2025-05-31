const { InteractionContextType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('strike')
		.setDescription('strikes a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('strikes a user').setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('specify the reason for striking a user').setRequired(true))
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		const person = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		const embeds = [];

		// Read the current file
		fs.readFile('strikes.json', 'utf8', (err, data) => {
			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			try {
				const json = JSON.parse(data);
				const newStrike = {
			        user: person,
			        reason: reason,
			        time: new Date().toISOString(),
		        };

				// Push new strike
				json.strikes.push(newStrike);

				let count = 0;

				for (let i = 0; i < json.strikes.length; i++) {
					if (json.strikes[i].user.id == person.id) {
						count++;
					}
				}

		        let message = '';

				if (count == 2) {
					message = '1';
				}
				else if (count == 3) {
					message = '3';
				}
				else if (count == 4) {
					message = '5';
				}

				const banEmbed = new EmbedBuilder()
					.setColor(0xFF0000)
				// ADD LATER: actually @ the person so they know they got striked
					.setTitle(`${person.username} has been banned.`)
					.setDescription(`${person.username} has been banned for ` + message + ' days.')
					.setTimestamp()
					.setFooter({ text: 'NARS Moderation', iconURL: 'https://cdn.discordapp.com/icons/1282262872675844106/fd63e5c9b231c482ec3a9bce40135a01.png?size=4096' });

				if (count > 1) {
					interaction.channel.send({ embeds: [banEmbed] });
				}

				// Write updated data back to file
				fs.writeFile('strikes.json', JSON.stringify(json, null, 2), (err) => {
					if (err) {
						console.error('Error writing file:', err);
					}
					else {
						console.log('Strike added successfully.');
					}
				});
			}
			catch (e) {
				console.error('Error parsing JSON:', e);
			}
		});

		const strikeEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
		// ADD LATER: actually @ the person so they know they got striked
			.setTitle(`${person.username} has received a strike.`)
			.setDescription('Reason: ' + reason)
			.setTimestamp()
			.setFooter({ text: 'NARS Moderation', iconURL: 'https://cdn.discordapp.com/icons/1282262872675844106/fd63e5c9b231c482ec3a9bce40135a01.png?size=4096' });

		embeds.push(strikeEmbed);

		await interaction.reply({ embeds });
	},
};