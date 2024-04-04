import { vehicle } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "register",
  type: 1,
  description: "register a vehicle",
  options: [
    {
      type: 3,
      name: "vehicle",
      description: "What vehicle",
      required: true,
      autocomplete: false,
    },
    {
      type: 3,
      name: "color",
      description: "What color",
      required: true,
      autocomplete: false,
    },
    {
      type: 3,
      name: "licenseplate",
      description: "What licenseplate",
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
  const user = interaction.user;
  const vehicle_name = interaction.options.getString("vehicle", true);
  const color = interaction.options.getString("color", true);
  const licenseplate = interaction.options.getString("licenseplate", true);
  const count = await vehicle.countDocuments({});

  const vehicle_save = new vehicle({
    ownerId: user.id,
    vehicle: vehicle_name,
    vehicleId: count + 1,
    color: color,
    licensePlate: licenseplate,
  });
  vehicle_save.save();
  /**@type {import("discord.js").APIEmbed[]} */
  var response = [
    {
      title: `Registered ${vehicle_name}`,
      color: client.settings.color,
    },
  ];
  response[0].fields = [
    {
      name: "Color",
      value: color,
      inline: true,
    },
    {
      name: "License Plate",
      value: licenseplate,
      inline: true,
    },
    {
      name: "Vehicle ID",
      value: count + 1,
      inline: true,
    },
  ];

  await interaction.editReply({ embeds: response, ephemeral: true });
}
