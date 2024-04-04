/**@type {import("../bot.js").Command} */
export const data = {
  name: "hello-world",
  type: 1, // u got 3 types, 1 is reg cmd, 2 is msg app, 3 is user app
  description: "yooo description",
  options: [
    {
      type: 3, // STRING Type
      name: "query",
      description: "search smth here!",
      required: false,
      choices: [{ name: "YOOOOO", value: "" }],
      autocomplete: false,
    },
  ],
  dm_permission: false, // ensures that the command cannot be used inside of dms
  default_member_permissions: 0, // u can use default member permission to lock cmds to certain permission levels, ex administrator, u can use permissionbitfield to get one if u cant via discord docs
};
/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction<'cached'>} interaction
 * @param {import("../bot.js").Bot} client
 */
export async function execute(interaction, client) {
  await interaction.deferReply({ ephemeral: true }); // must define whether its true or false for ephemeral, if u leave it blank wo ephemeral where it looks like: await interaction.deferReply(); then itll autoresort to no ephemeral
  const query = interaction.options.getString("query"); // for the true statement put inside of that constant, u only put true after the name to ensure its requirement is true, if not u js remove it

  /**@type {import("discord.js").APIEmbed[]} */ // u use [] if its an array, if its a object {}, then u js leave it wo array, ex APIEmbed
  const e = [
    {
      title: "Hello World",
      description: "hello world description", // if u use `` to use a function or constant u can use \` to make it in that black chat box, u dont need to use it if you have '' or "" instead
      color: client.settings.color,
    },
  ];
  await interaction.reply({ embeds: e, content: "hello" }); // u can use allowedMentions, ill provide the shit in a sec

  // is there auto_defer in djs?
  // python, if you used auto_defer emhemeral would only work in certain cases | yea ephemeral works for interaction.reply, u do have a defer options lemme show rq
  await interaction.editReply({ embeds: e }); // ephemeral hides message, if u have it as {} for ur embed instead of an array then u put {constnamehere} where embeds: is, ex. embeds: {constnamehere}
}
