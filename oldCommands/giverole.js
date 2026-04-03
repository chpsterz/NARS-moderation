/* const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giverole')
		.setDescription('Gives a role to a user by their ID')
		.addStringOption(option =>
			option.setName('roleid')
				.setDescription('The ID of the role to assign')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('The ID of the user to give the role to')
				.setRequired(true),
		),

	async execute(interaction) {
		const roleId = interaction.options.getString('roleid');
		const userId = interaction.options.getString('userid');

		// Fetch member
		const member = await interaction.guild.members.fetch(userId).catch(() => null);
		if (!member) {
			return interaction.reply({ content: `❌ User with ID \`${userId}\` not found in this server.`, ephemeral: true });
		}

		// Get role
		const role = interaction.guild.roles.cache.get(roleId);
		if (!role) {
			return interaction.reply({ content: `❌ Role with ID \`${roleId}\` not found.`, ephemeral: true });
		}

		// Try assigning role
		try {
			await member.roles.add(role);
			return interaction.reply({ content: `✅ Gave role **${role.name}** to <@${userId}>!`, ephemeral: false });
		}
		catch (error) {
			console.error(error);
			return interaction.reply({ content: '❌ I couldn’t give that role. Check my permissions and role hierarchy.', ephemeral: true });
		}
	},
};
*/