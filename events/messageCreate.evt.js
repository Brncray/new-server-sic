export const data = {
    name: "messageCreate"
};
/**
 * 
 * @param {import("discord.js").Message} message
 * @param {import("../bot.js").Bot} client
 */
export async function execute(message, client) {
    if (!message.inGuild()) return;

    if (message.author.bot) return;
    // get members that have the high command role and detect if the message has a mention of someone who has the role
    const highCommandRole = message.guild.roles.cache.get('1225483987024351262');
    if (!highCommandRole) return;
    const highCommandMembers = message.guild.members.cache.filter(m => m.roles.cache.has(highCommandRole.id));
    const mentionedMembers = message.mentions.members;
    if (mentionedMembers.size > 0) {
        await message.reply({content: "Please do not mention high command members in this channel."})
        return;
    }

}