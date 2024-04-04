import { exec } from "node:child_process";
/** @type {import("../../bot.js").Command} */
export const data = {
  name: "pull",
  type: 1,
  description: "Pull & Restart",
  dm_permission: false,
  default_member_permissions: 0,
};

/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction<'cached'>} interaction
 * @param {import("../../bot.js").Bot} client
 */
export async function execute(interaction, client) {
  await interaction.deferReply({ ephemeral: false });
  if (interaction.member.id != "539213950688952320") {
    return interaction.reply({
      content: "You do not have the proper permissions to use this command.",
      ephemeral: true,
    });
  }

  await interaction.editReply({
    content: `Pulling...`,
    ephemeral: false,
  });
  await exec("git pull origin main && npm install", async (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return interaction.editReply({
        content: `Error while pulling`,
        ephemeral: false,
      });
    }
    console.log(stdout);
    console.log(stderr);
    await interaction.editReply({
      content: `Pulled...`,
      ephemeral: false,
    });
  });
}