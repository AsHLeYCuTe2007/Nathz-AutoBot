module.exports.config = {
    name: "ivana",
    credits: "ryuko",
    version: '1.0.0',
    description: "talk with ivana alawi",
    prefix: false,
    premium: false,
    permission: 0,
    category: "without prefix",
    cooldowns: 0,
    dependencies: {
        "axios": ""
    }
}
const axios = require("axios");
module.exports.run = async function ({api, event, args }) {
    const ask = args.join(' ');
    if (!ask) {
        return api.sendMessage(`please provide a message`, event.threadID, event.messageID);
    }
    try {
        const res = await axios.get(`https://character-api.up.railway.app/api?name=ivana&message=${ask}`);
        const data = res.data;
        if (data.status == "success") {
            return api.sendMessage(data.message, event.threadID, event.messageID);
        } else {
            return api.sendMessage(data.message, event.threadID, event.messageID);
        }
    } catch (error) {
        return api.sendMessage(`something went wrong, please try again later`, event.threadID, event.messageID)
    }
}
