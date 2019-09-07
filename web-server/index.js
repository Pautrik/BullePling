const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const db = require('../db');
const { sendNotification } = require('../notification-manager');

const app = express();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const portNumber = 3000;

app.use(helmet())
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/public-vapid-key', (req, res) => {
    res.send(publicVapidKey);
});

app.post('/subscribe', (req, res) => {
    const hasValue = str =>
        str != null && str != "";

    const isValidSub = hasValue(endpoint) && hasValue(p256dh) && hasValue(auth);
    if(isValidSub) {
        db.setSub(req.body)
            .then(() => {
                res.status(201).send();
                sendNotification(req.body, { msg: 'Successfully subscribed to notifications' });
            })
            .catch(err => res.status(500).send());
    }
    else {
        res.status(400).send();
    }
});

app.post('/unsubscribe', (req, res) => {
    db.removeSub(req.body);
});

db.init().then(() =>
    app.listen(portNumber, () => console.log(`Listening on port ${portNumber}`)));
