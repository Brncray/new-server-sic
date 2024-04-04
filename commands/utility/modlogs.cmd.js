import { vehicle, ticket, modlog } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "modlogs",
  type: 1, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
  description: "view user's modlogs",
  options: [
    {
      type: 6, // STRING Type
      name: "user",
      description: "What user",
      required: false,
      autocomplete: false,
    },
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
  await interaction.deferReply({ ephemeral: false });
  const user = interaction.options.get("user")?.user || interaction.user;
  const modlogs = await modlog.find({ recipient: user.id });
  if(!interaction.member.roles.cache.has(client.settings.staff_role)) return await interaction.editReply({ content: "You do not have permission to use this command. If you are a staff member this means you do not have the ``Staff Team`` role", ephemeral: true });

  /**@type {import("discord.js").APIEmbed[]} */
  const response = [
    {
      title: `${user.displayName}'s modlogs`,
      color: client.settings.color,
    },
  ];
  if (modlogs.length == 0) {
    response[0].description = "No modlogs";
    return await interaction.editReply({ embeds: response, ephemeral: true });
  } else {
    response[0].fields = modlogs.map((t) => ({
      name: `Type: ${t.type} | Case ${t.case}`,
      value: `**User:** <@${t.recipient}>\n**Moderator:** <@${t.moderator}>\n**Reason: ** ${t.reason}\n**Evidence:** ${t.evidence} \n**Date:** <t:${Math.trunc(
        t.date / 1000,
      )}:D>\n\n`,
      inline: false,
    }));
    return await interaction.editReply({
      embeds: response,
      ephemeral: true,
    });
  }
}
