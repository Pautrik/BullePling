const isMeatballsToday = require('./isMeatballsToday');
const { getSubs } = require('../db');
const { sendNotification } = require('../notification-manager');

async function run() {
    const isMeatballs = await isMeatballsToday();
    if(!isMeatballs)
        return;

    const subs = await getSubs();
    for(let sub of subs) {
        await sendNotification(sub);
    }
}

run();
