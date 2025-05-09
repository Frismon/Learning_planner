package com.learningplanner.learningplan;

import com.learningplanner.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUser(User user);
    List<LearningPlan> findByUserAndStatus(User user, LearningPlanStatus status);
}
