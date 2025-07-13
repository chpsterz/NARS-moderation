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
		.addStringOption(option =>
			option.setName('queue')
				.setDescription('link the match result message').setRequired(true))
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		const person = interaction.options.getUser('user');
		const personBeingStriked = await interaction.guild.members.fetch(person.id).catch(() => null);
		const member = await interaction.guild.members.fetch(interaction.user.id);
		const queue = interaction.options.getString('queue') ?? '';

		if (await member.roles.cache.has('1324984176461746186')) {
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
						striker: interaction.user.id,
			        time: new Date(),
						strikeId: (json.strikes.length == 0) ? 0 : json.strikes[json.strikes.length - 1].strikeId + 1,
						q: `${queue}`,
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
					const roleId = '1375283461035921469';

					if (count == 2) {
						message = '1';
						personBeingStriked .roles.add(interaction.guild.roles.cache.get(roleId));
						setTimeout(() => {
							personBeingStriked .roles.remove(interaction.guild.roles.cache.get(roleId));
						}, 86400);
					}
					else if (count == 3) {
						message = '3';
						personBeingStriked .roles.add(interaction.guild.roles.cache.get(roleId));
						setTimeout(() => {
							personBeingStriked .roles.remove(interaction.guild.roles.cache.get(roleId));
						}, 259200);
					}
					else if (count == 4) {
						message = '5';
						personBeingStriked .roles.add(interaction.guild.roles.cache.get(roleId));
						setTimeout(() => {
							personBeingStriked .roles.remove(interaction.guild.roles.cache.get(roleId));
						}, 432000);
					}
					else if (count >= 5) {
						message = 'indefinite';
						personBeingStriked .roles.add(interaction.guild.roles.cache.get(roleId));
					}

					const banEmbed = new EmbedBuilder()
						.setColor(0x560000)
					// ADD LATER: actually @ the person so they know they got striked
						.setTitle(`${person.username} has been banned.`)
						.setDescription(`<@${person.id}> has received a ban for ${message} days.`)
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
				.setColor(0xff0000)
			// ADD LATER: actually @ the person so they know they got striked
				.setTitle(`${person.username} has received a strike.`)
				.setDescription(`<@${person.id}> has received a strike for ` + '`' + reason + '`' + `in the following queue ${queue}`)
				.setTimestamp()
				.setFooter({ text: 'NARS Moderation', iconURL: 'https://cdn.discordapp.com/icons/1282262872675844106/fd63e5c9b231c482ec3a9bce40135a01.png?size=4096' });

			embeds.push(strikeEmbed);

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