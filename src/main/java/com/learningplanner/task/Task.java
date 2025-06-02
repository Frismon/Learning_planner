package com.learningplanner.task;

import com.learningplanner.learningplan.LearningPlan;
import com.learningplanner.user.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private boolean completed = false;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;

    @DBRef
    private LearningPlan learningPlan;

    @DBRef
    private User user;

    private Priority priority = Priority.MEDIUM;

    private TaskStatus status = TaskStatus.PENDING;

    private String notes;

    private LocalDateTime reminder;

    private boolean isReminderSent = false;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    public enum TaskStatus {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
