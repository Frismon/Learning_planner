package com.learningplanner.notification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/push")
public class PushSubscriptionController {

    private final PushNotificationService pushNotificationService;
    private final PushSubscriptionRepository subscriptionRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public PushSubscriptionController(
            PushNotificationService pushNotificationService,
            PushSubscriptionRepository subscriptionRepository) {
        this.pushNotificationService = pushNotificationService;
        this.subscriptionRepository = subscriptionRepository;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(
            @RequestBody JsonNode subscription,
            Authentication authentication) {
        try {
            String userId = authentication.getName();
            String subscriptionJson = objectMapper.writeValueAsString(subscription);

            PushSubscription pushSubscription = new PushSubscription();
            pushSubscription.setUserId(userId);
            pushSubscription.setSubscriptionJson(subscriptionJson);
            pushSubscription.setActive(true);

            subscriptionRepository.save(pushSubscription);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(
            @RequestBody JsonNode subscription,
            Authentication authentication) {
        try {
            String userId = authentication.getName();
            subscriptionRepository.deleteByUserId(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<PushSubscription>> getSubscriptions(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<PushSubscription> subscriptions = subscriptionRepository.findByUserIdAndActiveTrue(userId);
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 