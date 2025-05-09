import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, GraduationCap, ListChecks, PlusCircle } from "lucide-react"
import { fetchTasks } from "@/lib/api"
import type { Task } from "@/lib/types"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function Home() {
  // Fetch tasks from backend
  let tasks: Task[] = []
  try {
    tasks = await fetchTasks()
  } catch (e) {
    // handle error if needed
  }
  const completedTasks = tasks.filter(task => task.completed)
  const totalTasks = tasks.length
  const percent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0
  const totalTime = completedTasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0)
  const quotes = [
    "Навіть найдовша подорож починається з першого кроку.",
    "Вчитися — це круто! Не зупиняйся!",
    "Кожен день — нова можливість стати кращим.",
    "Ти можеш більше, ніж думаєш!",
    "Успіх — це сума маленьких зусиль, повторюваних щодня.",
    "Знання — це сила!"
  ]
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <header>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Планувальник навчання</h1>
          <p className="text-muted-foreground text-lg">Керуйте своїми навчальними цілями та відстежуйте прогрес</p>
      </header>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <div className="bg-card rounded-2xl border shadow-xl p-8 transition-all hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Загальний прогрес</h2>
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-medium">Виконано завдань</span>
                <span className="text-base font-semibold">{completedTasks.length} / {totalTasks}</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full">
                <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-medium">Час на виконані завдання</span>
              <span className="text-base font-semibold">{totalTime} хв.</span>
            </div>
            <div className="italic text-muted-foreground text-center mt-6 text-lg flex items-center justify-center gap-2">
              <span>"{randomQuote}"</span>
              <span role="img" aria-label="lightbulb">💡</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-xl p-8 transition-all hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Найближчі завдання</h2>
            <ListChecks className="h-6 w-6 text-primary" />
          </div>
          <ul className="space-y-4">
            {upcomingTasks.length === 0 ? (
              <li className="text-muted-foreground">Немає активних завдань</li>
            ) : (
              upcomingTasks.map(task => (
                <li key={task.id} className="flex items-start gap-3 bg-secondary/50 rounded-xl p-4 shadow-sm">
                  <div className="h-7 w-7 flex-none rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
              </div>
              <div>
                    <p className="font-semibold text-lg">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "short" })}, {new Date(task.dueDate).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                    </p>
              </div>
            </li>
              ))
            )}
          </ul>
          <Button variant="outline" className="w-full mt-6 font-semibold text-base py-3 rounded-xl shadow-md" asChild>
            <Link href="/tasks">Переглянути всі завдання</Link>
          </Button>
        </div>

        <div className="bg-card rounded-2xl border shadow-xl p-8 transition-all hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Розклад</h2>
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2 bg-secondary/40 rounded-lg">
              <p className="font-semibold">Програмування</p>
              <p className="text-sm text-muted-foreground">Понеділок, 10:00 - 12:00</p>
            </div>
            <div className="border-l-4 border-primary pl-4 py-2 bg-secondary/40 rounded-lg">
              <p className="font-semibold">Математика</p>
              <p className="text-sm text-muted-foreground">Середа, 14:00 - 16:00</p>
            </div>
            <div className="border-l-4 border-primary pl-4 py-2 bg-secondary/40 rounded-lg">
              <p className="font-semibold">Англійська мова</p>
              <p className="text-sm text-muted-foreground">П'ятниця, 16:00 - 18:00</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6 font-semibold text-base py-3 rounded-xl shadow-md" asChild>
            <Link href="/calendar">Переглянути розклад</Link>
          </Button>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button asChild className="rounded-xl px-6 py-3 text-lg font-bold shadow-lg">
          <Link href="/add-plan">
            <PlusCircle className="mr-2 h-5 w-5" />
            Додати навчальний план
          </Link>
        </Button>
      </div>
    </div>
  )
}

