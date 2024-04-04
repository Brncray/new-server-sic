import { modlog } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "infract",
  type: 1, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
  description: "infract a civilian",
  options: [
    {
      name: "user",
      description: "What member ",
      required: true,
      type: 6,
    },
    {
      name: "reason",
      description: "What is the reason for the infraction",
      required: true,
      type: 3,
    },
    {
      name: "evidence",
      description: "What is the evidence for the infraction",
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
  var user = interaction.options.get("user").user;  
  const reason = interaction.options.getString("reason");
  const evidence = interaction.options.getString("evidence");
  const count = await modlog.countDocuments({});
  
  if(!interaction.member.roles.cache.has(client.settings.staff_role)) return await interaction.editReply({ content: "You do not have permission to use this command. If you are a staff member this means you do not have the ``Staff Team`` role", ephemeral: true });

  /**@type {import("discord.js").APIEmbed[]} */
  const response = [
    {
      title: "Infraction",
      description: `\n> Hello ${user}, you have received an infraction within ${interaction.guild.name} for \`\`${reason}\`\`. \n\n > Evidence: \`\`${evidence}\`\` \n\n> Signed, ${interaction.user}.`,
      color: client.settings.color,
    },
  ];

  /**@type {import("discord.js").APIEmbed[]} */
  const resp = [
    {
      title: "Member infracted",
      description: `\n${user} has been infracted\n> Reason: ${reason}\n> Evidence: ${evidence} `,
      color: client.settings.color,
    },
  ];

  const infractedUserAvatar = user.displayAvatarURL();
  const logEmbed = {
    title: `Member Infracted`,
    thumbnail: { url: infractedUserAvatar },
    description: `> ${interaction.user} has infracted ${user}\n> Reason: **${reason}**\n> Evidence: **\`\`${evidence}\`\`**.`,
    timestamp: interaction.createdAt,
    color: client.settings.color
  };

  const modlog_save = new modlog({
    recipient: user.id,
    moderator: interaction.user.id,
    type: "Infraction",
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
  try {
    await client.channels.cache.get(client.settings.log_channel).send({ embeds: [logEmbed] });
  } catch (e) {
    console.error(e);
  }
}
