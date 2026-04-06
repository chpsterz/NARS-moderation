const { InteractionContextType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { roles, punishments } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('strike')
		.setDescription('strikes a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('strikes a user').setRequired(true))
		.addStringOption(option =>
			option.setName('queue')
				.setDescription('link the match result message').setRequired(true))
		.addStringOption(option =>
			option.setName('type')
				.setDescription('type of strike')
				.setRequired(true)
				.addChoices(
					{ name: 'Throwing/Sabotaging/Griefing', value: '0' },
					{ name: 'ghostplaying/alting', value: '1' },
					{ name: 'not joining team vc/deafening', value: '2' },
					{ name: 'yelling/spoken toxicity/flooding comms', value: '3' },
					{ name: 'leaving before team select', value: '4' },
					{ name: 'leaving after team select', value: '5' },
				),
		)
		.addStringOption(option =>
			option.setName('description')
				.setDescription('please provide a couple of sentences of detail on some background on why the strike is deserved.').setRequired(true))
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		const person = interaction.options.getUser('user');
		const personBeingStriked = await interaction.guild.members.fetch(person.id).catch(() => null);
		const member = await interaction.guild.members.fetch(interaction.user.id);
		const queue = interaction.options.getString('queue') ?? '';
		const reason = interaction.options.getString('description') ?? 'No reason provided';

		if (await member.roles.cache.has(roles.queueMod)) {
			const length = punishments[interaction.options.getString('type')].punishmentLength;
			const embeds = [];

			// Read the current file
			fs.readFile('./strikes.json', 'utf8', (err, data) => {
				if (err) {
					console.error('Error reading file:', err);
					return;
				}

				try {
					const json = JSON.parse(data);
					const newStrike = {
			             user: person.id,
			             reason: reason,
					     selected: interaction.options.getString('type'),
					     striker: interaction.user.id,
			             time: new Date(),
					     strikeId: (json.strikes.length == 0) ? 0 : json.strikes[json.strikes.length - 1].strikeId + 1,
					     q: `${queue}`,
						 duration: length,
		        };

					// Push new strike
					json.strikes.push(newStrike);

					if (length != 0) {
						personBeingStriked .roles.add(interaction.guild.roles.cache.get(roles.queueBanned));
						setTimeout(() => {
							personBeingStriked.roles.remove(interaction.guild.roles.cache.get(roles.queueBanned));
						}, length * 1000);
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
				.setDescription(`<@${person.id}> has received a strike for ` + '`' + punishments[interaction.options.getString('type')].punishmentName + '`' + ` in the following queue #${queue} \n Queue Ban Duration: <t:${Math.floor(Date.now() / 1000) + Number(length)}:F> \n Comments: ${reason}`)
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