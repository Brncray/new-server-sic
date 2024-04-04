import { Collection } from "discord.js";
import { Bot } from "./bot.js";
import { config } from "dotenv";
config();
//process.on("uncaughtException", (e) => console.log("[ UNCAUGHT EXCEPTION ] →", e));
//process.on("unhandledRejection", (e) => console.log("[ UNHANDLED REJECTION ] →"), e);
(async () => {
    const client = new Bot({
        intents: 3276799, // ALL intents via - https://discord-intents-calculator.vercel.app/
    });
    client.settings = {
        color: 0x121212, // put color hex here for embeds n shit wo #
        iconURL: '',
        reports_channel: '1225491672490836169',

        log_channel: `1225491873234157641`,

        staff_role: `1225483986172907560`,

        emergency_role: `1225491981220712599`,

        admin_role: `1225483987024351262`
    };
    await client.init();
})();
