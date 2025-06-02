"use client"
import React, { useEffect, useState } from 'react';
import { fetchLearningPlans, fetchTasks } from '@/lib/api';
import { LearningPlan, Task } from '@/lib/types';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import Link from 'next/link';

dayjs.locale('uk');

export function StudyPlan() {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [plansData, tasksData] = await Promise.all([
          fetchLearningPlans(),
          fetchTasks()
        ]);
        setPlans(plansData);
        setTasks(tasksData);
      } catch (err) {
        setError('Помилка завантаження навчальних планів або завдань');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Помилка!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Функція для підрахунку прогресу для кожного плану
  const getPlanProgress = (planId: string) => {
    const planTasks = tasks.filter(task => (task as any).learningPlan === planId || (task as any).learningPlan?.id === planId);
    if (planTasks.length === 0) return 0;
    const completed = planTasks.filter(task => task.completed).length;
    return Math.round((completed / planTasks.length) * 100);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Навчальні плани</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const progress = getPlanProgress(plan.id);
          return (
            <Link href={`/plans/${plan.id}`} key={plan.id}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Початок:</span>
                    <span>{dayjs(plan.startDate).format('D MMMM YYYY')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Кінець:</span>
                    <span>{dayjs(plan.endDate).format('D MMMM YYYY')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Прогрес:</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      plan.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : plan.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {plan.priority === 'high' ? 'Високий' : plan.priority === 'medium' ? 'Середній' : 'Низький'} пріоритет
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 