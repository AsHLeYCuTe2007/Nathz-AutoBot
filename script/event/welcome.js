const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "welcome",
    version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.logMessageType === "log:subscribe") {
        const addedParticipants = event.logMessageData.addedParticipants;
        const senderID = addedParticipants[0].userFbId;
        let name = await api.getUserInfo(senderID).then(info => info[senderID].name);

        // Truncate name if it's too long
        const maxLength = 15;
        if (name.length > maxLength) {
            name = name.substring(0, maxLength - 3) + '...';
        }

        const groupInfo = await api.getThreadInfo(event.threadID);
        const groupIcon = groupInfo.imageSrc || "https://i.ibb.co/G5mJZxs/rin.jpg";
        const memberCount = groupInfo.participantIDs.length;
        const groupName = groupInfo.threadName || "this group";
        const background = groupInfo.imageSrc || "https://i.ibb.co/4YBNyvP/images-76.jpg";

        const url = `https://mademoiselle-rrest-apis-rr28.onrender.com/api/welcome?username=${encodeURIComponent(name)}&avatarUrl=https://api-canvass.vercel.app/profile?uid=${senderID}&groupname=${encodeURIComponent(groupName)}&bg=${encodeURIComponent(background)}&memberCount=${memberCount}`;

        try {
            const { data } = await axios.get(url, { responseType: 'arraybuffer' });
            const filePath = './script/cache/welcome_image.jpg';
            fs.writeFileSync(filePath, Buffer.from(data));

            api.sendMessage({
                body: `Everyone let's welcome our new member${name} to ${groupName}!`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));
        } catch (error) {
            console.error("Error fetching welcome image:", error);
            api.sendMessage({
                body: ``Everyone let's welcome our new member ${name} to ${groupName}!`
            }, event.threadID);
        }
    }
};
