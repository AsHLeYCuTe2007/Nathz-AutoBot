const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "goodbyenoti",
    version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.logMessageType === "log:unsubscribe") {
        const leftID = event.logMessageData.leftParticipantFbId;
        let name = await api.getUserInfo(leftID).then(info => info[leftID].name);

        // Truncate name if it's too long
        const maxLength = 15;
        if (name.length > maxLength) {
            name = name.substring(0, maxLength - 3) + '...';
        }

        const groupInfo = await api.getThreadInfo(event.threadID);
        const groupName = groupInfo.threadName || "this group";
        const memberCount = groupInfo.participantIDs.length;
        const background = groupInfo.imageSrc || "https://i.ibb.co/4YBNyvP/images-76.jpg";

        const url = `https://mademoiselle-rrest-apis-rr28.onrender.com/api/goodbye?pp=https://api-canvass.vercel.app/profile?uid=${leftID}&nama=${encodeURIComponent(name)}&bg=${encodeURIComponent(background)}&member=${memberCount}`;

        try {
            const { data } = await axios.get(url, { responseType: 'arraybuffer' });
            const filePath = './script/cache/goodbye_image.jpg';
            fs.writeFileSync(filePath, Buffer.from(data));

            api.sendMessage({
                body: `👋 ${name} has left ${groupName}. We’ll miss you!`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));
        } catch (error) {
            console.error("Error fetching goodbye image:", error);
            api.sendMessage({
                body: `👋 ${name} has left ${groupName}.`
            }, event.threadID);
        }
    }
};
