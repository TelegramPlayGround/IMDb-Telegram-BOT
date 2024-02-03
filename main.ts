import "std/dotenv/load.ts"; // load environment variables
import { Client, StorageLocalStorage } from "mtkruto/mod.ts";

// strings used in the bot
const NO_QS_INLINE_MESG = Deno.env.get("NO_QS_INLINE_MESG") as string;
const NO_QS_INLINE_DEEPL = Deno.env.get("NO_QS_INLINE_DEEPL") as string;
// END: strings used in the bot

const BOT_SESSION = Deno.env.get("BOT_SESSION") || "bot";

const TG_API_ID = parseInt(Deno.env.get("API_ID") || "0");
const TG_API_HASH = Deno.env.get("API_HASH");
const TG_BOT_TOKEN = Deno.env.get("BOT_TOKEN");

console.log("Starting Bot Client");
const botClient = new Client(
  new StorageLocalStorage(BOT_SESSION),
  TG_API_ID,
  TG_API_HASH,
);
await botClient.start(TG_BOT_TOKEN);

const botMe = await botClient.getMe();

console.log(`Logged in as ${botMe.username}`);
console.log("Started.");

import { GetIMDb, SearchIMDb } from "./imdb.ts";

botClient.on("message:text", async (ctx) => {
  if (!ctx.message.out) {
    return await ctx.reply(
      Deno.env.get("QOLNO_PM_MESG") as string,
      {
        parseMode: "HTML",
        replyMarkup: {
          inlineKeyboard: [
            [
              {
                text: Deno.env.get(
                  "QOLNO_PM_SRCH_BTN_TEXT",
                ) as string,
                switchInlineQueryCurrentChat: "",
              },
            ],
          ],
        },
      },
    );
  }
});

botClient.on("inlineQuery", async (ctx) => {
  const { from, query, offset } = ctx.inlineQuery;
  if (query.trim() === "") {
    // https://t.me/MTKrutoChat/3045
    return await ctx.answerInlineQuery([], {
      cacheTime: 0,
      isPersonal: true,
      isGallery: false,
      button: {
        text: NO_QS_INLINE_MESG,
        startParameter: NO_QS_INLINE_DEEPL,
      },
    });
  }
  if (offset === "") {
    const { results, nextOffset, button } = await SearchIMDb(query, 0, 10);
    return await ctx.answerInlineQuery(results, {
      cacheTime: 0,
      isPersonal: true,
      nextOffset: nextOffset,
      isGallery: false,
      button: button,
    });
  }
});

botClient.on("chosenInlineResult", async (ctx) => {
  const { resultId, from, inlineMessageId } = ctx.chosenInlineResult;
  const resultIdStp = resultId.split(" ");
  if (resultIdStp.length === 4) {
    const IMDbResponse = await GetIMDb(resultIdStp[3]);
    await ctx.editInlineMessageText(
      IMDbResponse.text,
      {
        parseMode: "HTML",
      },
    );
  }
});
