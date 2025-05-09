"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { toast } from "@/hooks/use-toast"
import BackButton from "@/components/BackButton"

export default function AddPlan() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    priority: "medium",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Імітація API запиту
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Успішна відповідь
      toast({
        title: "Навчальний план створено",
        description: "Ваш навчальний план було успішно додано.",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося створити навчальний план. Спробуйте ще раз.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
        <BackButton />
      <h1 className="text-3xl font-bold mb-6">Додати навчальний план</h1>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Деталі навчального плану</CardTitle>
            <CardDescription>Створіть новий навчальний план для відстеження вашого прогресу.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Назва</Label>
              <Input
                id="title"
                placeholder="Введіть назву навчального плану"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категорія</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть категорію" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">Програмування</SelectItem>
                  <SelectItem value="math">Математика</SelectItem>
                  <SelectItem value="language">Мови</SelectItem>
                  <SelectItem value="science">Наука</SelectItem>
                  <SelectItem value="other">Інше</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Опис</Label>
              <Textarea
                id="description"
                placeholder="Опишіть ваш навчальний план"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Дата початку</Label>
                <DatePicker date={formData.startDate} setDate={(date) => handleChange("startDate", date)} />
              </div>
              <div className="space-y-2">
                <Label>Дата завершення</Label>
                <DatePicker date={formData.endDate} setDate={(date) => handleChange("endDate", date)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Пріоритет</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть пріоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Високий</SelectItem>
                  <SelectItem value="medium">Середній</SelectItem>
                  <SelectItem value="low">Низький</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isLoading}>
              Скасувати
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Збереження..." : "Зберегти план"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </div>
  )
}
