const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Deletes a number of messages in this channel.')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Number of messages to delete (1-100)')
				.setRequired(true)),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		// Check limits
		if (amount < 1 || amount > 100) {
			return interaction.reply({ content: 'You must choose a number between 1 and 100.', ephemeral: true });
		}

		// Delete messages
		await interaction.deferReply({ ephemeral: true });
		const deletedMessages = await interaction.channel.bulkDelete(amount, true);

		return interaction.editReply({ content: `🧹 Deleted ${deletedMessages.size} messages.` });
	},
};
