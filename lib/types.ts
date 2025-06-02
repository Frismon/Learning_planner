export interface Task {
  id: string
  title: string
  description: string
  category: string
  completed: boolean
  dueDate: string
  createdAt: string
  updatedAt: string
  priority: "high" | "medium" | "low"
  estimatedTime: number
  notes?: string
  reminder?: string
  isReminderSent?: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  category: string
  startTime: string
  endTime: string
}

export interface LearningPlan {
  id: string
  title: string
  description: string
  category: string
  startDate: string
  endDate: string
  progress: number
  priority: "high" | "medium" | "low"
  notes?: string
}
