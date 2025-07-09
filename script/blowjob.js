const axios = require("axios");

module.exports.config = {
  name: "blowjob",
  version: "1.0.0",
  author: "vern",
  description: "Get a random NSFW blowjob image.",
  prefix: true,
  cooldowns: 5,
  commandCategory: "nsfw",
  dependencies: {
    axios: ""
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    // Send loading message
    await api.sendMessage("🔞 Fetching random blowjob image, please wait...", threadID, messageID);

    const apiUrl = "https://kaiz-apis.gleeze.com/api/blowjob?apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5";
    const response = await axios.get(apiUrl, { responseType: "stream" });

    // Send the image back as an attachment
    return api.sendMessage({
      body: "🔞 Here is your random blowjob image.",
      attachment: response.data
    }, threadID, messageID);

  } catch (error) {
    console.error("❌ Error in blowjob command:", error.message || error);
    return api.sendMessage(
      `❌ Failed to fetch blowjob image.\nError: ${error.response?.data?.message || error.message || "Unknown error"}`,
      threadID,
      messageID
    );
  }
};
