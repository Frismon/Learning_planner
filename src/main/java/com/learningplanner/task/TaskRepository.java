package com.learningplanner.task;

import com.learningplanner.learningplan.LearningPlan;
import com.learningplanner.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUser(User user);
    List<Task> findByLearningPlan(LearningPlan learningPlan);
    List<Task> findByUserAndStatus(User user, Task.TaskStatus status);
    List<Task> findByLearningPlanAndStatus(LearningPlan learningPlan, Task.TaskStatus status);
    List<Task> findByStatus(Task.TaskStatus status);
    List<Task> findByReminderBeforeAndIsReminderSentFalse(LocalDateTime dateTime);
}
