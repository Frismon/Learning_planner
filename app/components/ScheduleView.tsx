'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { useAuth } from '@/app/contexts/AuthContext';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';

dayjs.locale('uk');

interface ScheduleViewProps {
  tasks: Task[];
}

export default function ScheduleView({ tasks }: ScheduleViewProps) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [weekStart, setWeekStart] = useState(currentDate.startOf('week'));

  useEffect(() => {
    setWeekStart(currentDate.startOf('week'));
  }, [currentDate]);

  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  const getTasksForDay = (date: dayjs.Dayjs) => {
    return tasks.filter(task => dayjs(task.dueDate).isSame(date, 'day'));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Розклад на тиждень</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(currentDate.subtract(1, 'week'))}
            className="btn btn-secondary"
          >
            Попередній тиждень
          </button>
          <button
            onClick={() => setCurrentDate(currentDate.add(1, 'week'))}
            className="btn btn-secondary"
          >
            Наступний тиждень
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="card min-h-[200px]"
          >
            <div className="font-medium mb-2">
              {day.format('dddd')}
              <br />
              {day.format('D MMMM')}
            </div>

            <div className="space-y-2">
              {getTasksForDay(day).map((task) => (
                <div
                  key={task.id}
                  className={`p-2 rounded-md ${getPriorityColor(task.priority)}`}
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm opacity-80">
                    {dayjs(task.dueDate).format('HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 