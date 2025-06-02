package com.learningplanner.task;

import com.learningplanner.exception.ResourceNotFoundException;
import com.learningplanner.user.User;
import com.learningplanner.learningplan.LearningPlanRepository;
import com.learningplanner.notification.PushNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final LearningPlanRepository learningPlanRepository;
    private final PushNotificationService pushNotificationService;

    @Autowired
    public TaskService(
            TaskRepository taskRepository,
            LearningPlanRepository learningPlanRepository,
            PushNotificationService pushNotificationService) {
        this.taskRepository = taskRepository;
        this.learningPlanRepository = learningPlanRepository;
        this.pushNotificationService = pushNotificationService;
    }

    public List<Task> getAllTasks(Task.TaskStatus status) {
        if (status != null) {
            return taskRepository.findByStatus(status);
        }
        return taskRepository.findAll();
    }

    public Task getTaskById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(String id, Task taskDetails) {
        Task task = getTaskById(id);
        
        if (taskDetails.getTitle() != null) {
            task.setTitle(taskDetails.getTitle());
        }
        if (taskDetails.getDescription() != null) {
            task.setDescription(taskDetails.getDescription());
        }
        if (taskDetails.getDueDate() != null) {
            task.setDueDate(taskDetails.getDueDate());
        }
        if (taskDetails.getPriority() != null) {
            task.setPriority(taskDetails.getPriority());
        }
        if (taskDetails.getStatus() != null) {
            task.setStatus(taskDetails.getStatus());
        }
        task.setCompleted(taskDetails.isCompleted());
        
        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByUser(user);
    }

    public void checkAndSendReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Task> tasks = taskRepository.findByReminderBeforeAndIsReminderSentFalse(now);
        for (Task task : tasks) {
            // Відправка push-сповіщення
            sendPushNotification(task);
            task.setReminderSent(true);
            taskRepository.save(task);
        }
    }

    private void sendPushNotification(Task task) {
        String title = "Нагадування про завдання";
        String message = String.format("Завдання '%s' має бути виконане до %s", 
            task.getTitle(), 
            task.getDueDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
        
        pushNotificationService.sendNotificationToUser(task.getUser().getId(), title, message);
    }
}
