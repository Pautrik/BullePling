console.log('Loaded service worker!');

self.addEventListener('push', ev => {
    const data = ev.data.json();
    console.log('Got push', data);
    ev.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/assets/favicon-64.png',
            badge: '/assets/favicon-32.png'
        })
    );
});