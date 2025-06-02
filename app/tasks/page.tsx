"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Calendar, Clock, BookOpen } from "lucide-react"
import { fetchTasks, updateTask } from "@/lib/api"
import type { Task } from "@/lib/types"
import BackButton from "@/components/BackButton"
import { useAuth } from '@/app/contexts/AuthContext'
import TaskForm from '@/app/components/TaskForm'
import TaskList from '@/app/components/TaskList'
import ScheduleView from '@/app/components/ScheduleView'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    loadTasks()
  }, [token])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const tasks = await fetchTasks()
      setTasks(tasks)
    } catch (err) {
      setError('Не вдалося завантажити завдання')
      console.error('Error fetching tasks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask])
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    )
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    setIsLoading(true)
    try {
      await updateTask(id, { completed })
      setTasks(tasks =>
        tasks.map(task =>
          task.id === id ? { ...task, completed } : task
        )
      )
    } catch (e) {
    } finally {
      setIsLoading(false)
    }
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "medium":
        return "bg-yellow-400 hover:bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "Високий";
      case "medium":
        return "Середній";
      case "low":
        return "Низький";
      default:
        return priority;
    }
  }

  const TaskItem = ({ task }: { task: Task }) => (
    <div className="flex items-start space-x-4 p-4 border-b last:border-0">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => toggleTaskCompletion(task.id, !task.completed)}
        className="mt-1"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor={`task-${task.id}`}
            className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
          >
            {task.title}
          </label>
          <Badge className={getPriorityColor(task.priority)}>
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>
        <div className="mb-2">
          <p className="text-gray-600">{task.description}</p>
          {task.notes && <p className="text-gray-500 italic mt-1">Нотатки: {task.notes}</p>}
          {task.reminder && <p className="text-gray-500 italic mt-1">Нагадування: {new Date(task.reminder).toLocaleString("uk-UA")}</p>}
        </div>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-1" />
          <span className="mr-4">{task.category}</span>
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-4">
            {new Date(task.dueDate).toLocaleDateString("uk-UA")} {new Date(task.dueDate).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <Clock className="h-4 w-4 mr-1" />
          {task.estimatedTime > 0 && <span>{task.estimatedTime} хв.</span>}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Завдання</h1>
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Список</TabsTrigger>
          <TabsTrigger value="completed">Виконані</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <TaskList
            tasks={pendingTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        </TabsContent>

        <TabsContent value="completed">
          <TaskList
            tasks={completedTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleView tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
