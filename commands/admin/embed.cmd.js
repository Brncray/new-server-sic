import { vehicle, ticket, modlog } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "embed",
  type: 1, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
  description: "send an embed",
  options: [
    {
        type: 3, // STRING Type
        name: "title",
        description: "What is the title of the embed",
        required: true,
        },
        {
        type: 3, // STRING Type
        name: "description",
        description: "What is the description of the embed",
        required: true,
        },
        {
        type: 3, // STRING Type
        name: "color",
        description: "What is the color of the embed",
        required: false,
    }
  ],
  dm_permission: false,
  default_member_permissions: 0,
};
/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction<'cached'>} interaction
 * @param {import("../bot.js").Bot} client
 */
export async function execute(interaction, client) {
    if (!interaction.member.permissions.has("Administrator")) return await interaction.editReply({ content: "You do not have permission to use this command. If you are a staff member this means you do not have the ``Administrator`` permission", ephemeral: true });
    await await interaction.reply({content: "Embed sent!", ephemeral: true});
    await await interaction.deleteReply(); 
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const color = interaction.options.getString("color") || 0x313338;
    const embed = {
        title: title,
        description: description,
        color: color
    }
    await interaction.channel.send({embeds: [embed]});

}
