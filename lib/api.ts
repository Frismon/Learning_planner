

import type { Task, CalendarEvent, LearningPlan } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.replace(/^\/+/g, "");
  const response = await fetch(`${API_URL}/${cleanEndpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}


export async function fetchTasks(): Promise<Task[]> {
  return apiRequest<Task[]>("tasks")
}

export async function fetchTaskById(id: string): Promise<Task> {
  return apiRequest<Task>(`tasks/${id}`)
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  return apiRequest<Task>("tasks", {
    method: "POST",
    body: JSON.stringify(task),
  })
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  return apiRequest<Task>(`tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  })
}

export async function deleteTask(id: string): Promise<void> {
  await apiRequest(`tasks/${id}`, {
    method: "DELETE",
  })
}

export async function fetchCalendarEvents(startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
  let url = "calendar-events"

  if (startDate && endDate) {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
    url += `?${params.toString()}`
  }

  return apiRequest<CalendarEvent[]>(url)
}

export async function createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
  return apiRequest<CalendarEvent>("calendar-events", {
    method: "POST",
    body: JSON.stringify(event),
  })
}

export async function updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
  return apiRequest<CalendarEvent>(`calendar-events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  })
}

export async function deleteEvent(id: string): Promise<void> {
  await apiRequest(`calendar-events/${id}`, {
    method: "DELETE",
  })
}

export async function fetchLearningPlans(): Promise<LearningPlan[]> {
  return apiRequest<LearningPlan[]>("learning-plans")
}

export async function fetchLearningPlanById(id: string): Promise<LearningPlan> {
  return apiRequest<LearningPlan>(`learning-plans/${id}`)
}

export async function createLearningPlan(plan: Omit<LearningPlan, "id">): Promise<LearningPlan> {
  return apiRequest<LearningPlan>("learning-plans", {
    method: "POST",
    body: JSON.stringify(plan),
  })
}

export async function updateLearningPlan(id: string, updates: Partial<LearningPlan>): Promise<LearningPlan> {
  return apiRequest<LearningPlan>(`learning-plans/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  })
}

export async function deleteLearningPlan(id: string): Promise<void> {
  await apiRequest(`learning-plans/${id}`, {
    method: "DELETE",
  })
}
