package com.learningplanner.notification;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class PushNotificationService {
    private final PushService pushService;
    private final ObjectMapper objectMapper;
    private final PushSubscriptionRepository subscriptionRepository;

    @Autowired
    public PushNotificationService(PushSubscriptionRepository subscriptionRepository) {
        // В реальному проекті ключі мають бути в конфігурації
        this.pushService = new PushService();
        this.objectMapper = new ObjectMapper();
        this.subscriptionRepository = subscriptionRepository;
    }

    public void sendNotificationToUser(String userId, String title, String message) {
        List<PushSubscription> subscriptions = subscriptionRepository.findByUserIdAndActiveTrue(userId);
        
        for (PushSubscription subscription : subscriptions) {
            try {
                sendNotification(subscription.getSubscriptionJson(), title, message);
            } catch (Exception e) {
                e.printStackTrace();
                // Якщо сповіщення не вдалося відправити, деактивуємо підписку
                subscription.setActive(false);
                subscriptionRepository.save(subscription);
            }
        }
    }

    public void sendNotification(String subscriptionJson, String title, String message) {
        try {
            Subscription subscription = objectMapper.readValue(subscriptionJson, Subscription.class);
            Notification notification = new Notification(
                subscription,
                objectMapper.writeValueAsString(new NotificationPayload(title, message))
            );
            pushService.send(notification);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static class NotificationPayload {
        private final String title;
        private final String message;

        public NotificationPayload(String title, String message) {
            this.title = title;
            this.message = message;
        }
    }
} 