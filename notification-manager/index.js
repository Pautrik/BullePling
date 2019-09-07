const webPush = require('web-push');

const { removeSub } = require('../db')

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails('mailto:patema@student.chalmers.se', publicVapidKey, privateVapidKey);

async function sendNotification(sub, payload) {
    try {
        await webPush.sendNotification(sub, JSON.stringify(payload));
    } catch(err) {
        if(err.statusCode == 404 || err.statusCode == 410) {
            await removeSub(sub);
        }
    }
}

module.exports = { sendNotification };