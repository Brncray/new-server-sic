import { vehicle, ticket } from "../../data/mongodb.js";

/**@type {import("../bot.js").Command} */
export const data = {
  name: "profile",
  type: 1, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
  description: "view a profile",
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
  if (interaction.options.get("user") == null) {
    var user = interaction.user;
  } else if (interaction.options.get("user") != null) {
    var user = interaction.options.get("user").user;
  }

  if (user.bot) {
    return interaction.editReply({
      content: "You cannot view a bot's profile.",
    });
  }
  const vehicles = await vehicle.find({ ownerId: user.id });
  const tickets = await ticket.find({ recipient: user.id });

  /**@type {import("discord.js").APIEmbed[]} */
  const response = [
    {
      title: `${user.username}'s Profile`,
      fields: [
        {
          name: "Citations",
          value: `${tickets.length}`,
          inline: true,
        },
        {
          name: "Vehicles",
          value: `${vehicles.length}`,
          inline: true,
        },
      ],
      color: client.settings.color,
    },
  ];

  const r = [
    {
      type: 1,
      /**@type {import("discord.js").APIButtonComponent[]} */
      components: [
        { label: "Citations", type: 2, style: 1, custom_id: "citations" },
        {
          label: "Registered Vehicles",
          type: 2,
          style: 1,
          custom_id: "registered_vehicles",
        }
        
      ],
    },
  ];


  const message = interaction.editReply({
    embeds: response,
    components: r,
  });

  const collector = (await message).createMessageComponentCollector({
    filter: (componentInteraction) =>
      componentInteraction.user.id === interaction.user.id,
    time: 30000,
  });

  collector.on("collect", async (componentInteraction) => {
    await componentInteraction.deferReply({ ephemeral: true});
    
    if (componentInteraction.customId === "citations") {
      const tickets = await ticket.find({ recipient: user.id });
      /**@type {import("discord.js").APIEmbed[]} */
      var response = [
        {
          title: `${user.username}'s Citations`,
          color: client.settings.color,
        },
      ];

      if (tickets.length == 0) {
        response.description = "No Citations";
        return await componentInteraction.editReply({ embeds: response, ephemeral: true});
      } else {
        /**@type {import("discord.js").APIEmbed[]} */
        var response = [
          {
            title: `${user.username}'s Citations`,
            color: client.settings.color,
          },
        ];
        response[0].fields = tickets.map((t) => ({
          name: "Ticket",
          value: `**Reason:** ${t.charges}\n**Fine:** ${t.fine}\n**Officer:** ${
            t.officer
          }\n**Case Number:** ${t.case}\n**Date:** <t:${Math.trunc(t.date / 1000)}:D>\n\n`,
          inline: false,
        }));
        return await componentInteraction.editReply({ embeds: response, ephemeral: true });

      }
    }
    if (componentInteraction.customId == "registered_vehicles") {
      const vehicles = await vehicle.find({ ownerId: user.id });
      if (vehicles.length == 0) {
        return await componentInteraction.editReply({
          content: "No registered vehicles.",
          ephemeral: true,
        });
      }
      /**@type {import("discord.js").APIEmbed[]} */
      var response = [
        {
          title: `${user.username}'s Vehicles`,
          color: client.settings.color,
        },
      ];
      response[0].fields = vehicles.map((v) => ({
        name: "REGISTERED VEHICLE",
        value: `**Vehicle:** ${v.vehicle}\n**Color:** ${v.color}\n**License Plate:** ${v.licensePlate}\n**ID:** ${v.vehicleId}\n**Date Registered:** <t:${Math.trunc(v.date / 1000)}:D>\n\n`,
        inline: false,
      }));
      return await componentInteraction.editReply({ embeds: response, ephemeral: true });
    }
  });
  
  collector.on("end", async (collected, reason) => {
    if (reason == "time") {
      interaction.deleteReply();
    }
  });
}
