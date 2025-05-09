package com.learningplanner.task;

import com.learningplanner.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
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
}
