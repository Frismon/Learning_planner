package com.learningplanner.notification;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "push_subscriptions")
public class PushSubscription {
    @Id
    private String id;
    private String userId;
    private String subscriptionJson;
    private boolean active;
} 