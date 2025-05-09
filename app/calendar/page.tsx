"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchCalendarEvents, fetchTasks } from "@/lib/api"
import type { CalendarEvent, Task } from "@/lib/types"
import BackButton from "@/components/BackButton"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<"month" | "week" | "day">("week")

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [eventsData, tasksData] = await Promise.all([
          fetchCalendarEvents(),
          fetchTasks()
        ])
        setEvents(eventsData)
        setTasks(tasksData)
      } catch (error) {
        console.error("Помилка завантаження подій або завдань:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
  const months = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ]

  const getMonthData = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Adjust first day to start from Monday (1) instead of Sunday (0)
    let dayOfWeek = firstDay.getDay() || 7
    dayOfWeek = dayOfWeek - 1

    const daysInMonth = lastDay.getDate()

    const weeks = []
    let days = []

    // Add previous month days
    for (let i = 0; i < dayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -dayOfWeek + i + 1)
      days.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        events: getEventsForDate(prevMonthDay),
      })
    }

    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        events: getEventsForDate(currentDate),
      })

      if (days.length === 7) {
        weeks.push(days)
        days = []
      }
    }

    // Add next month days
    if (days.length > 0) {
      const daysToAdd = 7 - days.length
      for (let i = 1; i <= daysToAdd; i++) {
        const nextMonthDay = new Date(year, month + 1, i)
        days.push({
          date: nextMonthDay,
          isCurrentMonth: false,
          events: getEventsForDate(nextMonthDay),
        })
      }
      weeks.push(days)
    }

    return weeks
  }

  const getWeekData = (date: Date) => {
    const currentDay = date.getDay() || 7 // Convert Sunday (0) to 7
    const diff = date.getDate() - currentDay + 1 // Adjust to Monday

    const weekStart = new Date(date)
    weekStart.setDate(diff)

    const days = []

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart)
      currentDate.setDate(weekStart.getDate() + i)

      days.push({
        date: currentDate,
        events: getEventsForDate(currentDate),
      })
    }

    return days
  }

  const getDayData = (date: Date) => {
    const hours = []

    for (let i = 8; i < 20; i++) {
      // 8 AM to 8 PM
      const hourDate = new Date(date)
      hourDate.setHours(i, 0, 0, 0)

      hours.push({
        time: hourDate,
        events: getEventsForHour(hourDate),
      })
    }

    return hours
  }

  const getEventsForDate = (date: Date) => {
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
    const dayTasks = tasks.filter((task) => {
      const due = new Date(task.dueDate)
      return (
        due.getDate() === date.getDate() &&
        due.getMonth() === date.getMonth() &&
        due.getFullYear() === date.getFullYear() &&
        !task.completed // показувати лише активні
      )
    })
    // Приводимо завдання до формату event-like
    const mappedTasks = dayTasks.map(task => {
      const start = new Date(task.dueDate);
      const end = new Date(start.getTime() + (task.estimatedTime || 60) * 60000);
      const priority = (task.priority || 'low').toLowerCase();
      console.log('DEBUG CALENDAR TASK:', task.title, 'priority:', task.priority, 'mapped priority:', priority);
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        priority,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        isTask: true
      }
    })
    return [...dayEvents, ...mappedTasks]
  }

  const getEventsForHour = (date: Date) => {
    const hourEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getHours() === date.getHours()
      )
    })
    const hourTasks = tasks.filter((task) => {
      const due = new Date(task.dueDate)
      return (
        due.getDate() === date.getDate() &&
        due.getMonth() === date.getMonth() &&
        due.getFullYear() === date.getFullYear() &&
        new Date(task.dueDate).getHours() === date.getHours() &&
        !task.completed
      )
    })
    const mappedTasks = hourTasks.map(task => {
      const start = new Date(task.dueDate);
      const end = new Date(start.getTime() + (task.estimatedTime || 60) * 60000);
      const priority = (task.priority || 'low').toLowerCase();
      console.log('DEBUG CALENDAR TASK:', task.title, 'priority:', task.priority, 'mapped priority:', priority);
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        priority,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        isTask: true
      }
    })
    return [...hourEvents, ...mappedTasks]
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  const getHeaderText = () => {
    if (view === "month") {
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    } else if (view === "week") {
      const weekData = getWeekData(currentDate)
      const startDate = weekData[0].date
      const endDate = weekData[6].date

      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.getDate()} - ${endDate.getDate()} ${months[startDate.getMonth()]} ${startDate.getFullYear()}`
      } else {
        return `${startDate.getDate()} ${months[startDate.getMonth()]} - ${endDate.getDate()} ${months[endDate.getMonth()]} ${startDate.getFullYear()}`
      }
    } else {
      return `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    }
  }

  // Helper for task color
  const getTaskColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-400 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  }

  const renderMonthView = () => {
    const monthData = getMonthData(currentDate)

    return (
      <div className="grid grid-cols-7 gap-1">
        
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center font-medium">
            {day}
          </div>
        ))}

        {monthData.flat().map((day, index) => (
          <div
            key={index}
            className={`min-h-[100px] border rounded-md p-1 ${day.isCurrentMonth ? "bg-card" : "bg-muted/30"} ${
              day.date.getDate() === new Date().getDate() &&
              day.date.getMonth() === new Date().getMonth() &&
              day.date.getFullYear() === new Date().getFullYear()
                ? "border-primary"
                : ""
            }`}
          >
            <div className="text-right p-1 font-medium">{day.date.getDate()}</div>
            <div className="space-y-1">
              {day.events.slice(0, 2).map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={`text-xs p-1 rounded truncate ${
                    (event as any).isTask
                      ? getTaskColor((event as any).category ? (event as any).priority : "low")
                      : event.category === "programming"
                      ? "bg-blue-100 text-blue-800"
                      : event.category === "math"
                        ? "bg-green-100 text-green-800"
                        : event.category === "language"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {new Date(event.startTime).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })} -{" "}
                  {event.title} {(event as any).isTask && <span>📝</span>}
                </div>
              ))}
              {day.events.length > 2 && (
                <div className="text-xs text-muted-foreground p-1">+{day.events.length - 2} ще</div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekData = getWeekData(currentDate)

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekData.map((day, index) => (
          <div key={index} className="space-y-1">
            <div
              className={`text-center p-2 font-medium rounded-t-md ${
                day.date.getDate() === new Date().getDate() &&
                day.date.getMonth() === new Date().getMonth() &&
                day.date.getFullYear() === new Date().getFullYear()
                  ? "bg-primary/10"
                  : ""
              }`}
            >
              <div>{daysOfWeek[index]}</div>
              <div>{day.date.getDate()}</div>
            </div>
            <div className="border rounded-b-md p-2 space-y-2 min-h-[300px] bg-card">
              {day.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={`text-sm p-2 rounded ${
                    (event as any).isTask
                      ? getTaskColor((event as any).category ? (event as any).priority : "low")
                      : event.category === "programming"
                      ? "bg-blue-100 text-blue-800"
                      : event.category === "math"
                        ? "bg-green-100 text-green-800"
                        : event.category === "language"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-xs">
                    {new Date(event.startTime).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })} -
                    {new Date(event.endTime).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    const dayData = getDayData(currentDate)

    return (
      <div className="space-y-2">
        <div className="text-center p-2 font-medium">
          {daysOfWeek[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}, {currentDate.getDate()}{" "}
          {months[currentDate.getMonth()]}
        </div>
        <div className="space-y-1">
          {dayData.map((hour, index) => (
            <div key={index} className="grid grid-cols-12 border rounded-md">
              <div className="col-span-1 p-2 border-r text-center">{hour.time.getHours()}:00</div>
              <div className="col-span-11 p-2 min-h-[60px]">
                {hour.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`text-sm p-2 rounded ${
                      (event as any).isTask
                        ? getTaskColor((event as any).category ? (event as any).priority : "low")
                        : event.category === "programming"
                        ? "bg-blue-100 text-blue-800"
                        : event.category === "math"
                          ? "bg-green-100 text-green-800"
                          : event.category === "language"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs">
                      {new Date(event.startTime).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })} -
                      {new Date(event.endTime).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
        <BackButton />
      <h1 className="text-3xl font-bold mb-6">Розклад</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{getHeaderText()}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={navigateToday}>
                Сьогодні
              </Button>
              <Button variant="outline" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Select value={view} onValueChange={(value: "month" | "week" | "day") => setView(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Вигляд" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Місяць</SelectItem>
                  <SelectItem value="week">Тиждень</SelectItem>
                  <SelectItem value="day">День</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>Перегляд та керування вашим навчальним розкладом</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {view === "month" && renderMonthView()}
              {view === "week" && renderWeekView()}
              {view === "day" && renderDayView()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
