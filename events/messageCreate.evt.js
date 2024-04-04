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

    
}

