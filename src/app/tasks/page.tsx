'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  category: string;
  completed: boolean;
  createdAt: string;
  contactId: string | null;
}

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const PRIORITY_LABELS: Record<string, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Media',
  LOW: 'Baja',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'upcoming'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await fetch('/api/tasks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed: !completed }),
      });
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !completed } : t
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filteredTasks = tasks.filter(task => {
    if (task.completed) return filter === 'all';
    if (!task.dueDate) return filter === 'all';
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case 'overdue':
        return dueDate < today;
      case 'today':
        return dueDate.getTime() === today.getTime();
      case 'upcoming':
        return dueDate > today;
      default:
        return true;
    }
  });

  const overdueCount = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < today).length;
  const todayCount = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString()).length;
  const upcomingCount = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) > today).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Tareas</h2>
          <p className="text-gray-500 dark:text-gray-400">{pendingCount} tareas pendientes</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card 
          className={`cursor-pointer transition-all bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${filter === 'all' ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => setFilter('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Todas</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tasks.length}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${filter === 'overdue' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilter('overdue')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueCount}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${filter === 'today' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setFilter('today')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Hoy</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{todayCount}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${filter === 'upcoming' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Próximas</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{upcomingCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
            {filter === 'all' ? 'Todas las tareas' : 
             filter === 'overdue' ? 'Tareas vencidas' :
             filter === 'today' ? 'Tareas para hoy' : 'Próximas tareas'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No hay tareas
              </div>
            ) : (
              filteredTasks.map(task => {
                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                const isOverdue = dueDate && dueDate < today;
                const isToday = dueDate && dueDate.toDateString() === today.toDateString();
                
                return (
                  <div 
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      task.completed 
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                        : isOverdue
                          ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                          : isToday
                            ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTask(task.id, task.completed)}
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                        }`}
                      >
                        {task.completed && <CheckCircle className="h-3 w-3" />}
                      </button>
                      <div>
                        <p className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM}`}>
                        {PRIORITY_LABELS[task.priority] || 'Media'}
                      </span>
                      {dueDate && (
                        <span className={`text-xs ${isOverdue ? 'text-red-600 dark:text-red-400' : isToday ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {dueDate.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
