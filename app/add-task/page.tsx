"use client"

import { useState } from "react";
import { createTask } from "@/lib/api";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { toast } from "@/hooks/use-toast";
import type { Task } from "@/lib/types";

export default function AddTasksPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    category: "",
    completed: false,
    dueDate: new Date().toISOString(),
    priority: "medium",
    estimatedTime: 0,
    notes: "",
    reminder: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleChange = (field: string, value: any) => {
    if(field === "priority") {
      console.log('DEBUG PRIORITY SELECTED:', value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);


    const payload = {
      ...formData,
      priority: formData.priority.toUpperCase(), 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
  
    };

    try {
      await createTask(payload as any); 
      toast({
        title: "Завдання створено",
        description: "Ваше завдання було успішно додано.",
      });
      router.push("/tasks");
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося створити завдання. Спробуйте ще раз.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Додати завдання</h1>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Деталі завдання</CardTitle>
            <CardDescription>Створіть нове завдання для відстеження вашого прогресу.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Назва</Label>
              <Input
                id="title"
                placeholder="Введіть назву завдання"
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
                placeholder="Опишіть ваше завдання"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Дата дедлайну</Label>
              <DatePicker 
                date={new Date(formData.dueDate)} 
                setDate={(date) => handleChange("dueDate", date.toISOString())} 
              />
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

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Орієнтовний час виконання (хвилини)</Label>
              <Input
                id="estimatedTime"
                type="number"
                min="1"
                value={formData.estimatedTime}
                onChange={(e) => handleChange("estimatedTime", parseInt(e.target.value))}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Нотатки</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reminder" className="block text-sm font-medium text-gray-700">Нагадування</label>
              <input
                id="reminder"
                name="reminder"
                type="datetime-local"
                value={formData.reminder}
                onChange={(e) => handleChange("reminder", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/tasks")} disabled={isLoading}>
              Скасувати
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Збереження..." : "Зберегти завдання"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 