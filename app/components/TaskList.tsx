'use client';

import { Task } from '@/lib/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { useState } from 'react';
import { updateTask, deleteTask } from '@/lib/api';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  const handleStatusChange = async (task: Task, completed: boolean) => {
    try {
      const updatedTask = await updateTask(task.id, { completed });
      onTaskUpdated(updatedTask);
    } catch (err) {
      setError('Не вдалося оновити завдання');
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити це завдання?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      onTaskDeleted(taskId);
    } catch (err) {
      setError('Не вдалося видалити завдання');
      console.error('Error deleting task:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'Високий';
      case 'MEDIUM':
        return 'Середній';
      case 'LOW':
        return 'Низький';
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {tasks.map((task) => (
        <div
          key={task.id}
          className="card hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleStatusChange(task, e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </h3>
              </div>

              {task.description && (
                <p className="mt-2 text-gray-600">{task.description}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
                <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Немає завдань
        </div>
      )}
    </div>
  );
} 