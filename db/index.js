const { Database } = require('sqlite3');

let db;
const tableName = 'subs';

async function init() {
    return new Promise((resolve, reject) => {
        db = new Database(`${__dirname}/sqlite.db`);
        db.run(
            `CREATE TABLE IF NOT EXISTS ${tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                endpoint TEXT NOT NULL,
                p256dh TEXT NOT NULL,
                auth TEXT NOT NULL
            );`,
            err => err ? reject(err) : resolve()
        );
    });
}

function setSub({ endpoint, keys: { p256dh, auth } }) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO subs(endpoint, p256dh, auth) SELECT ?, ?, ? WHERE NOT EXISTS(SELECT 1 FROM subs WHERE endpoint = ? AND p256dh = ? AND auth = ?);`,
            endpoint,
            p256dh,
            auth,
            endpoint,
            p256dh,
            auth,
            err => err ? reject(err) : resolve()
        );
    });
}

function removeSub({ endpoint, keys: { p256dh, auth } }) {
    return new Promise((resolve, reject) => {
        db.run(
            `DELETE FROM ${tableName} WHERE endpoint = ? AND p256dh = ? AND auth = ?;`,
            endpoint,
            p256dh,
            auth,
            () => resolve()
        );
    });
}

function getSubs() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT endpoint, p256dh, auth FROM ${tableName};`,
            (err, rows) => {
	        if(err) {
		    reject(err);
		    return;
		}
		const formRows = rows.map(({ endpoint, p256dh, auth }) => ({ endpoint, keys: { p256dh, auth } }));
		resolve(formRows);
	    }
        );
    });
}

process.on('SIGINT', () => {
    db.close();
    process.exit();
});

module.exports = { init, setSub, getSubs, removeSub };
