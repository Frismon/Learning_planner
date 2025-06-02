import type { Task, CalendarEvent, LearningPlan } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.replace(/^\/+/g, "");
  const token = await getAuthToken()
  const url = `${API_URL}/${cleanEndpoint}`
  
  console.log('Making API request to:', url)
  console.log('Request options:', {
    method: options?.method || 'GET',
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    body: options?.body
  })
  
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" }));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        error: errorData
      });
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
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

export async function login(email: string, password: string) {
  try {
    console.log('Attempting login for:', email);
    const response = await apiRequest<{ token: string }>("api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem("token", response.token);
      console.log('Login successful, token stored');
    }
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function register(email: string, password: string, username: string) {
  try {
    console.log('Attempting registration for:', { email, username });
    const response = await apiRequest<{ token: string }>("api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    });
    
    if (response.token) {
      localStorage.setItem("token", response.token);
      console.log('Registration successful, token stored');
    }
    
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}
