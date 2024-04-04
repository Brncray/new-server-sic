import { modlog } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "reason",
  type: 1, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
  description: "strike a staff member",
  options: [
    {
      name: "case",
      description: "What case number",
      required: true,
      type: 4,
    },
    {
      name: "reason",
      description: "the new reason",
      required: true,
      type: 3,
    },
  ],
  dm_permission: false, // ensures that the command cannot be used inside of dms
  default_member_permissions: 0, // u can use default member permission to lock cmds to certain permission levels, ex administrator, u can use permissionbitfield to get one if u cant via discord docs
};
/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction<'cached'>} interaction
 * @param {import("../bot.js").Bot} client
 */
export async function execute(interaction, client) {
  await interaction.deferReply({ ephemeral: true });
  if (!interaction.member.permissions.has("Administrator")) return await interaction.editReply({ content: "You do not have permission to use this command. If you are a staff member this means you do not have the ``Administrator`` permission", ephemeral: true });
  const reason = interaction.options.getString("reason");
  const case_num = interaction.options.getInteger("case");
  const find = await modlog.findOne({ case: case_num });
  if (!find) {
    return await interaction.editReply({
    content: "Case not found",
    ephemeral: true,
  })}
  find.reason = reason;
  find.save();

  /**@type {import("discord.js").APIEmbed[]} */
  const resp = [
    {
      title: `Case ${case_num} edited`,
      description: `\n> Case ${case_num} reason edited to: ${reason}`,
      color: client.settings.color,
    },
  ];



  await interaction.editReply({
    embeds: resp,
    ephemeral: true,
  })

  
}
