import { DiscordAPIError } from "discord.js";
import { modlog } from "../../data/mongodb.js";
/** @type {import("../../bot.js").Command} */
export const data = {
  name: "ban",
  type: 1,
  description: "Ban Command for Staff",
  options: [
    {
      type: 6, // USER Type
      name: "user",
      description: "The User who is going to be Banned",
      required: true
    },
    {
      type: 3, // STRING Type
      name: "ban-reason",
      description: "The Reason for the ban",
      required: true
    },
    {
      type: 3, // STRING Type
      name: "ban-type",
      description: "What is the Ban Type? Ex. Appealable or Unappealable Ban",
      required: true,
      choices: [
        {
          name: "Appealable Ban",
          value: "appealable"
        },
        {
          name: "Unappealable Ban",
          value: "unappealable"
        }
      ]
    },
    {
      type: 3, // STRING Type
      name: "evidence",
      description: "Evidence for Ban",
      required: true
    }
  ],
  default_member_permissions: 0,
  dm_permission: true
};
// Validate if the Session Link is a URL
function isValidURL(url) {
  // Regular expression to validate URL format
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}
/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction<'cached'>} interaction
 * @param {import("../../bot.js").Bot} client
 */
export async function execute(interaction, client) {
  const AdministratorRole = interaction.guild.roles.cache.get(
    client.settings.admin_role
  );
  if (!interaction.member.roles.cache.has(AdministratorRole.id)) {
    return await interaction.reply({
      content: "**You do not have Permission to use this Command!**",
      ephemeral: true
    });
  }

  const BannedUser = interaction.options.getUser("user");
  const bannedMember = interaction.options.getMember("user");
  const BannedUserAvatar = BannedUser.displayAvatarURL();
  const selectedBanType = interaction.options.getString("ban-type");
  const BanReason = interaction.options.getString("ban-reason");
  const evidenceURL = interaction.options.getString("evidence") || undefined;

  // Validate if the Evidence Link is a URL
  if (!isValidURL(evidenceURL)) {
    return await interaction.reply({
      content: "Invalid Evidence URL",
      ephemeral: true
    });
  }

  if (
    bannedMember.roles.highest.comparePositionTo(
      interaction.member.roles.highest
    ) >= 0
  ) {
    return await interaction.reply({
      content: "**You do not have permission to ban this user.**",
      ephemeral: true
    });
  }

  if (!bannedMember.bannable) {
    return await interaction.reply({
      content: `I can't ban that user.`,
      ephemeral: true
    });
  }

  if (bannedMember.id === interaction.member.id) {
    return await interaction.reply({
      content: `You cannot ban yourself.`,
      ephemeral: true
    });
  }

  /** @type {import("discord.js").APIEmbed[]} */
  const embeds = {
    title: "Greenville Community Roleplay | Issued Ban",
    color: client.settings.color,
    timestamp: interaction.createdAt
  };

  if (selectedBanType === "appealable") {
    embeds.description = `> You have been issued a **APPEALABLE BAN** from ${interaction.guild.name}, this is due to: **${BanReason}**.\n\n> \`\`Evidence:\`\`${evidenceURL}\n\n> If you believe this ban was false, please contact a member of the staff team to discuss about it.`;
    // Appealable Ban Format
  } else if (selectedBanType === "unappealable") {
    embeds.description = `> You have been issued a **UNAPPEALABLE BAN** from ${interaction.guild.name}, this is due to: **${BanReason}**.\n\n> \`\`Evidence:\`\`${evidenceURL}\n\n> If you believe this ban was false, please contact a member of the staff team to discuss about it.`;
    // Unappealable Ban Format
  }

  let banTypeName;

  if (selectedBanType === "appealable") {
    banTypeName = "Appealable Ban";
  } else if (selectedBanType === "unappealable") {
    banTypeName = "Unappealable Ban";
  }

  const logEmbed = {
    title: `Member Banned`,
    thumbnail: { url: BannedUserAvatar },
    description: `> ${interaction.user} has banned ${BannedUser}\n> Reason: **${BanReason}**\n> Ban Type: **\`\`${banTypeName}\`\`**.`,
    timestamp: interaction.createdAt,
    color: client.settings.color
  };

  const replyEmbed = {
    description: `${BannedUser} has been Successfully Banned!`,
    color: client.settings.color,
    timestamp: interaction.createdAt,
    color: 0x2fff00
  };

  /** @type {import("discord.js").APIActionRowComponent[]} */
  const rows = [];

  if (selectedBanType === "appealable") {
    rows.push({
      type: 1,
      components: [
        {
          label: "Ban Appeal Form",
          type: 2,
          style: 5,
          url: "https://google.com"
        }
      ]
    });
  }
  let type; 
  if (selectedBanType === "unappealable") {
    type = "Unappealable Ban";
  } else if (selectedBanType === "appealable") {
    type = "Appealable Ban";
  }
  const count = await modlog.countDocuments({});

  try {
    const m = new modlog({
        recipient: BannedUser.id,
        moderator: interaction.user.id,
        type: type,
        reason: BanReason,
        evidence: evidenceURL,
        case: count + 1 
    });

    await m.save();
  } catch (error) {
    console.error("Error while registering the Modlog:", error);
    return await interaction.reply({
      content: `An error occurred while registering your Moderation Log: ${error}`,
      ephemeral: true
    });
  }

  /** @type {import("discord.js").APIEmbed[]} */
  const eE = [
    {
      color: client.settings.color,
      footer: {
        text: `${interaction.guild.name}`,
        icon_url: `${interaction.guild.iconURL()}`
      }
    }
  ];

  try {
    const BanUser = interaction.options.getUser("user");
    await interaction.guild.members.ban(BanUser, { reason: BanReason });
    try {
    await BanUser.send({ embeds: [embeds], components: rows });
    } catch (error) {
      eE[0].description = `${BanUser}'s DMs are disabled, actions still processed.`;
      await interaction.followUp({ embeds: eE, ephemeral: true });
    }
    const channel = client.channels.cache.get(client.settings.log_channel);
    await channel.send({ embeds: [logEmbed] });
    await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
  } catch (error) {
    console.error(error);
    return await interaction.reply({
      content: `An error occurred while processing your request: ${error}`,
      ephemeral: true
    });
  }
}
