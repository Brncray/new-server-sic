import { vehicle } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "unregister",
  type: 1,
  description: "unregister a vehicle",
  options: [
    {
      type: 4,
      name: "vehicle",
      description: "What vehicle number",
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
  const vehicle_number = interaction.options.getInteger("vehicle", true);
  const vehicle_data = await vehicle.findOne({ vehicleId: vehicle_number, ownerId: user.id});
  if (!vehicle_data) {
    return interaction.editReply({
      content: "Vehicle not found.",
      ephemeral: true,
    });
  }
  if (vehicle_data.ownerId !== user.id) {
    return interaction.editReply({
      content: "You do not own this vehicle.",
      ephemeral: true,
    });
  }
  await vehicle.deleteOne({ vehicleId: vehicle_number });

  await interaction.editReply({
    content: `Unregistered vehicle ${vehicle_data.vehicle}.`,
    ephemeral: true,
  });
}
