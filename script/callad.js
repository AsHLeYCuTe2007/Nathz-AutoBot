const moment = require("moment-timezone");

let fontEnabled = true;

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (fontEnabled && char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.config = {
  name: "callad",
  version: "1.0.1",
  role: 0,
  credits: "Developer",
  hasPrefix: false,
  description: "Report bot's error to admin or comment",
  cooldown: 10
};

module.exports.run = async function({ api, event, args, admin }) {
  if (!args[0]) return api.sendMessage(formatFont("You have not entered the content to report"), event.threadID, event.messageID);

  const name = await getUserName(api, event.senderID);
  const mentions = [{
    tag: name,
    id: event.senderID
  }];
  
  const threadInfo = await api.getThreadInfo(event.threadID);
  const time = moment.tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");

  api.sendMessage(formatFont(`Your report has been sent to the bot admin successfully\nAt: ${time}`), event.threadID, () => {
    for (let o of admin) {
      const threadName = threadInfo.threadName || "Unnamed";
      const reportContent = formatFont(`▱▱▱[𝗖𝗔𝗟𝗟 𝗔𝗗𝗠𝗜𝗡]▱▱▱\n\n- User Name: ${name}\n- User ID: ${event.senderID}\n- Sent from group: ${threadName}\n- Thread ID: ${event.threadID}\n\nContent:\n─────────────────\n${args.join(" ")}\n─────────────────\nTime: ${time}`);
      api.sendMessage(reportContent, o);
    }
  });
};
