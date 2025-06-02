package com.learningplanner.notification;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PushSubscriptionRepository extends MongoRepository<PushSubscription, String> {
    List<PushSubscription> findByUserIdAndActiveTrue(String userId);
    void deleteByUserId(String userId);
} 