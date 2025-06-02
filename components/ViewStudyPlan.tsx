"use client"
import React, { useEffect, useState } from 'react';
import { fetchLearningPlanById } from '@/lib/api';
import { LearningPlan } from '@/lib/types';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';

dayjs.locale('uk');

interface ViewStudyPlanProps {
  planId: string;
}

export function ViewStudyPlan({ planId }: ViewStudyPlanProps) {
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const data = await fetchLearningPlanById(planId);
        setPlan(data);
      } catch (err) {
        setError('Помилка завантаження навчального плану');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [planId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Помилка!</strong>
        <span className="block sm:inline"> {error || 'Навчальний план не знайдено'}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{plan.title}</h1>
          <p className="text-gray-600">{plan.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          plan.priority === 'high' 
            ? 'bg-red-100 text-red-800'
            : plan.priority === 'medium'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {plan.priority === 'high' ? 'Високий' : plan.priority === 'medium' ? 'Середній' : 'Низький'} пріоритет
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Дати</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Початок:</span>
              <span>{dayjs(plan.startDate).format('D MMMM YYYY')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Кінець:</span>
              <span>{dayjs(plan.endDate).format('D MMMM YYYY')}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Прогрес</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Загальний прогрес:</span>
              <span className="font-semibold">{plan.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${plan.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Категорія</h3>
        <p className="text-gray-600">{plan.category}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Нотатки</h3>
        <p className="text-gray-700">{plan.notes || "Немає нотаток"}</p>
      </div>
    </div>
  );
} 