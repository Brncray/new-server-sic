import { Message } from "discord.js";
import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";



/**@type {import("../bot.js").Command} */
export const data = {
  name: "Report message",
  type: 3, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
};
/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction<'cached'>} interaction
 * @param {import("../bot.js").Bot} client
 */
export async function execute(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  const message = interaction.options.getMessage("message"); // get the message that was right clicked
  const messageContent = message.content; // get the content of the message
  const author = message.author; // author of the reported message
  const channel = client.channels.cache.get(client.settings.reports_channel); // get the channel from the cache
  const user = interaction.user; // get the user who reported the message

  /**@type {import("discord.js").APIEmbed[]} */
  const response = [
    {
      title: `New Report`,
      description: `**Reported message: "${messageContent}"**\n[Jump to message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
      color: client.settings.color,
      fields: [
        { name: "Reporter", value: `${interaction.user}`, inline: true },
        { name: "Reported User", value: `${author}`, inline: true },
      ],
    },
  ];

  channel.send({ embeds: response }); // send the report to the reports channel

  await interaction.editReply({
    content:
      "Report anonymously sent! Remember that abusing this system will result in a blacklist from the bot & an infraction",
    ephemeral: true,
  }); // validation reply
}
