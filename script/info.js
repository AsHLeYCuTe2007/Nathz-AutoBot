const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "info",
  version: "1.0",
  role: 0,
  credits: "Kaizenji",
  description: "Get bot and admin information.",
  cooldown: 5,
  hasPrefix: false,
  aliases: ["owner"],
  usage: "info",
};

module.exports.run = async function({ api, event, admin }) {
  const tid = event.threadID;
  const mid = event.messageID;

  try {
    const adminInfo = await api.getUserInfo(admin);
    const adminName = adminInfo[admin].name;
    const botUid = await api.getCurrentUserID();
    const botInfo = await api.getUserInfo(botUid);
    const botName = botInfo[botUid].name;
    const welcomeCardURL = `https://api.popcat.xyz/welcomecard?background=https://cdn.popcat.xyz/welcome-bg.png&text1=Autobot+Information&text2=${botName}&text3=Messenger+chatbot&avatar=https://api-canvass.vercel.app/profile?uid=${botUid}`;

    const cacheDir = __dirname + `/cache/`;
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    const outputPath = cacheDir + `welcome_${botUid}.png`;

    const response = await axios({
      method: "get",
      url: welcomeCardURL,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `🤖 | 𝗔𝘂𝘁𝗼𝗯𝗼𝘁 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻\n\n𝗕𝗼𝘁𝗻𝗮𝗺𝗲: ${botName}\n𝗕𝗼𝘁 𝗙𝗕: facebook.com/${botUid}\n𝗔𝗱𝗺𝗶𝗻 𝗻𝗮𝗺𝗲: ${adminName}\n𝗔𝗱𝗺𝗶𝗻 𝗙𝗕: facebook.com/${admin}\n\n𝗗𝗲𝘃: kaizenji-info.pages.dev`,
        attachment: fs.createReadStream(outputPath),
      }, tid, () => {
        try {
          fs.unlinkSync(outputPath);
        } catch (error) {
          console.error(`Failed to delete file ${outputPath}:`, error);
        }
      }, mid);
    });

    writer.on("error", (err) => {
      api.sendMessage(`Error: ${err.message}`, tid, mid);
    });

  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, tid, mid);
  }
};
