import { modlog } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "strike",
  type: 1, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
  description: "strike a staff member",
  options: [
    {
      name: "user",
      description: "What staff member ",
      required: true,
      type: 6,
    },
    {
      name: "reason",
      description: "What is the reason for the strike",
      required: true,
      type: 3,
    },
    {
      name: "evidence",
      description: "What is the evidence for the strike",
      required: true,
      type: 3,
    }
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
  var user = interaction.options.get("user").user;  
  const reason = interaction.options.getString("reason");
  const evidence = interaction.options.getString("evidence");
  const count = await modlog.countDocuments({});
  
  /**@type {import("discord.js").APIEmbed[]} */
  const response = [
    {
      title: "Staff Action | Strike",
      description: `\n> Hello ${user}, you have received a staff strike within ${interaction.guild.name} for \`\`${reason}\`\`. \n\n > Evidence: \`\`${evidence}\`\` \n\n> If you wish to appeal this strike/infraction, please open a Staff Report or DM a High-Ranking member.\n> Signed, ${interaction.user}.`,
      color: client.settings.color,
    },
  ];
  
  /**@type {import("discord.js").APIEmbed[]} */
  const resp = [
    {
      title: "Staff Member Striked",
      description: `\n${user} has been striked for: ${reason}\nEvidence: ${evidence} `,
      color: client.settings.color,
    },
  ];

  const modlog_save = new modlog({
    recipient: user.id,
    moderator: interaction.user.id,
    type: "Staff Strike",
    reason: reason,
    evidence: evidence,
    case: count + 1,
  })
  modlog_save.save();
  
  await interaction.editReply({
    embeds: resp,
    ephemeral: true,
  })
  await client.users.send(user.id, {
    embeds: response,
  })

}
