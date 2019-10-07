let publicVapidKey;

async function init() {
    const res = await fetch('/public-vapid-key');
    publicVapidKey = await res.text();
}

async function subscribe() {
    if (!'serviceWorker' in navigator) {
        alert(`Browser doesn't support service workers, unable to subscribe to notifications`);
        return;
    }

    if (!'PushManager' in window) {
        alert(`Browser doesn't support web push, unable to subscribe to notifications`);
        return;
    }

    console.log('Trying to register service worker');

    try {
        navigator.serviceWorker.register(`${window.location.pathname}worker.js`);
        console.log('Service worker successfully registred');
    } catch (err) {
        alert(`Couldn't subscribe, failed to register service worker`);
        return;
    }


    const registration = await navigator.serviceWorker.ready;

    let subscription;
    try {
        subscription = await registration.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });
    } catch (err) {
        alert(`Couldn't subscribe, failed to register push manager`);
        return;
    }

    try {
        const resp = await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription.toJSON()),// Body is fucked up
            headers: {
                'content-type': 'application/json'
            }
        });

        if (!resp.ok) {
            switch (resp.status) {
                case 400:
                    alert('Failed to subscribe, invalid parameters');
                    break;
                case 500:
                    alert('Failed to subscribe, internal server error');
                    break;
                default:
                    alert('Failed to subscribe, an error occured');
            }
        }
    } catch (e) {
        alert('Failed to subscribe, an error occured');
    }
}

// Function from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function unsubscribe() {
    if ('serviceWorker' in navigator) {
        console.log("Removing service worker");
        const reg = await navigator.serviceWorker.getRegistration();
        if (typeof reg !== "undefined") {
            const sub = await reg.pushManager.getSubscription();
            if (typeof sub !== "undefined") {
                fetch("/unsubscribe", {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(sub)
                })
            }

            reg.unregister();
            console.log("Service worker removed")
        }
    }
}

function testNotification() {
    fetch("/test-notification", { method: "POST" });
}

init();
