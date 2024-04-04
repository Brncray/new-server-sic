import { vehicle, ticket } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "ticket",
  type: 1, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
  description: "ticket a user",
  options: [
    {
      type: 6,
      name: "user",
      description: "What user",
      required: true,
      autocomplete: false,
    },
    {
      type: 3,
      name: "charges",
      description: "What charges",
      required: true,
      autocomplete: false,
    },
    {
      type: 4,
      name: "fine",
      description: "What fine",
      required: true,
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
  await interaction.deferReply({ ephemeral: true });
  if(!interaction.member.roles.cache.has(client.settings.emergency_role)) return await interaction.editReply({ content: "You do not have permission to use this command. If you are a LEO this means you do not have the ``Emergency Services`` role", ephemeral: true });

  const user = interaction.options.get("user").user;
  if (user.bot) {
    return interaction.editReply({
      content: "You cannot ticket a bot.",
    });
  }
  const officer = interaction.user.id;
  const charges = interaction.options.getString("charges", true);
  const fine = interaction.options.getInteger("fine", true);
  const count = await ticket.countDocuments({})
  const ticket_save = new ticket({
    recipient: user.id,
    officer: `<@${officer}>`,
    charges: charges,
    fine: fine,
    case: count + 1,
  });
  await ticket_save.save();
  await interaction.editReply({
    content: `Ticketed ${user.username} for ${charges} with a fine of $${fine}.`,
    ephemeral: true,
  });
  
  try {
    /**@type {import("discord.js").APIEmbed[]} */
    var response = [
      {
        title: `New Citation`,
        fields: [
          {
            name: "Recipient",
            value: `<@${user.id}>`,
            inline: true,
          },
          {
            name: "Officer",
            value: `<@${officer}>`,
            inline: true,
          },
          {
            name: "Charges",
            value: `${charges}`,
            inline: true,
          },
          {
            name: "Fine",
            value: `$${fine}`,
            inline: true,
          },
          {
            name: "Case Number",
            value: `${count}`,
          }
        ],
        color: client.settings.color,
      },
    ];
    await user.send({
      embeds: response
    });
  } catch (error) {}
}
