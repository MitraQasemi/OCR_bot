const { Telegraf, Context } = require("telegraf");
const http = require('https');
const fs = require('fs');
const Test = require("tesseract.js");


const bot = new Telegraf("5502703199:AAFLBB8x8A9ktthIOOd6jvp9NzdyP8g0sag");
bot.start(ctx => {
    console.log(ctx.message.from);
    ctx.reply("Hi");
})


bot.on("message", async ctx => {
    ctx.reply("you sent a photo");
    console.log(ctx);
    const file1 = await ctx.telegram.getFileLink(ctx.update.message.photo[2].file_id)
    const file = fs.createWriteStream(ctx.update.message.message_id + "file.jpg");
    const request = http.get(file1, function (response) {
        response.pipe(file);
        file.on("finish", () => {
            file.close();
            console.log("Download Completed");
            ctx.replyWithChatAction("typing");
            Test.recognize(ctx.update.message.message_id + "file.jpg", 'eng', { logger: e => console.log(e) })
                .then(out => {
                    ctx.replyWithChatAction("typing");
                    ctx.reply(out.data.text);
            });
        });
    });
});
bot.launch();