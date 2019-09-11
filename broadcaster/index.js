const isMeatballsToday = require('./isMeatballsToday');
const { init, getSubs } = require('../db');
const { sendNotification } = require('../notification-manager');

async function run() {
    await init();
    const isMeatballs = await isMeatballsToday();
    if(!isMeatballs)
        return;

    const subs = await getSubs();
    for(let sub of subs) {
        await sendNotification(sub, { title: "BullePling", body: "There are meatballs at express today!!" });
    }
}

run();
