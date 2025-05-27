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
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks()
        setTasks(data)
      } catch (error) {
        console.error("Помилка завантаження завдань:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

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
        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
        <BackButton />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Завдання</h1>
        <Button asChild>
          <Link href="/add-task">
            <PlusCircle className="mr-2 h-4 w-4" />
            Додати завдання
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pending">Активні ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Завершені ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Активні завдання</CardTitle>
              <CardDescription>Список завдань, які потрібно виконати.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : pendingTasks.length > 0 ? (
                <div className="divide-y">
                  {pendingTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Немає активних завдань</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Завершені завдання</CardTitle>
              <CardDescription>Список завдань, які ви вже виконали.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : completedTasks.length > 0 ? (
                <div className="divide-y">
                  {completedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Немає завершених завдань</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
}
