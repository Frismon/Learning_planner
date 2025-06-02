export async function subscribeToPushNotifications() {
  try {
    // Реєструємо service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    
    // Запитуємо дозвіл на сповіщення
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Дозвіл на сповіщення не надано');
    }

    // Отримуємо підписку
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });

    // Відправляємо підписку на сервер
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    return true;
  } catch (error) {
    console.error('Помилка при підписці на сповіщення:', error);
    return false;
  }
}

export async function unsubscribeFromPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    }
    
    return true;
  } catch (error) {
    console.error('Помилка при відписці від сповіщень:', error);
    return false;
  }
} 