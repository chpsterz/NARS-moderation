/* const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removerole')
		.setDescription('Removes a role from a user by their ID')
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('The ID of the user to remove the role from')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('roleid')
				.setDescription('The ID of the role to remove')
				.setRequired(true),
		),

	async execute(interaction) {
		const userId = interaction.options.getString('userid');
		const roleId = interaction.options.getString('roleid');

		// Fetch the member from the guild
		const member = await interaction.guild.members.fetch(userId).catch(() => null);
		if (!member) {
			return interaction.reply({ content: `❌ User with ID \`${userId}\` not found in this server.`, ephemeral: true });
		}

		const role = interaction.guild.roles.cache.get(roleId);
		if (!role) {
			return interaction.reply({ content: `❌ Role with ID \`${roleId}\` not found.`, ephemeral: true });
		}

		try {
			await member.roles.remove(role);
			return interaction.reply({ content: `✅ Removed role **${role.name}** from <@${userId}>.`, ephemeral: false });
		}
		catch (error) {
			console.error(error);
			return interaction.reply({ content: '❌ I couldn’t remove that role. Check my permissions and role hierarchy.', ephemeral: true });
		}
	},
};
*/