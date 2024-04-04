import { DiscordAPIError, UserFlags } from "discord.js";

export const data = {
    name: "guildMemberAdd"
};

/**
 * @param {import("discord.js").GuildMember} newGuildMember
 * @param {import("../bot").Bot} client
 */
export async function execute(newGuildMember, client) {
    if (newGuildMember.user.bot && !newGuildMember.user.flags.has(UserFlags.VerifiedBot)) {
        await newGuildMember.ban({reason:"Unverified Bot"})
        /**@type {import("discord.js").APIEmbed[]} */
        const securityEmbed = [
            {
                title: "SECURITY ALERT",
                description: `Unverified bot ${newGuildMember.user.tag} has been banned.\n> Verified: \`\`false\`\`\n> Invited by: \`\`${newGuildMember.inviter.tag}\`\``,
                color: 0xFF0000
            }
        ]
        const staffChannel = client.channels.cache.get('1225486376233996449');
        if(!staffChannel) return; 
        staffChannel.send({embeds: securityEmbed})
        return; 
    }
    const autoRoles = client.settings.autoRoles;

    for (const role of autoRoles) {
        const guildRole = newGuildMember.guild.roles.cache.get(role);
        if (!guildRole) continue;
        await newGuildMember.roles.add(guildRole);
    }
}