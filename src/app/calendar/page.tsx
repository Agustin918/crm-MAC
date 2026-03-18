'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CrmButton, IconButton } from '@/components/ui/crm-button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string | null;
  priority: string;
  category: string;
  completed: boolean;
  createdBy?: string;
  assignedTo?: string;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm

const PRIORITY_COLORS = {
  HIGH: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
};

const CATEGORY_ICONS: Record<string, string> = {
  CALL: '📞',
  MEETING: '🤝',
  EMAIL: '✉️',
  TASK: '✅',
  OTHER: '📌',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const response = await res.json();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };
  
  const weekDays = getWeekDays();
  
  const getTasksForHour = (date: Date, hour: number) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString() && taskDate.getHours() === hour;
    });
  };
  
  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      HIGH: 'Alta',
      MEDIUM: 'Media',
      LOW: 'Baja',
    };
    return labels[priority] || priority;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendario</h1>
          <p className="text-gray-500 dark:text-gray-400">Vista semanal de tus tareas y eventos</p>
        </div>
        <div className="flex items-center gap-2">
          <CrmButton variant="outline" onClick={goToToday}>Hoy</CrmButton>
          <IconButton variant="outline" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </IconButton>
          <IconButton variant="outline" onClick={() => navigateWeek(1)}>
            <ChevronRight className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="dark:bg-[#141416] dark:border-[#27272A]">
        <CardContent className="p-0">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b dark:border-[#27272A]">
            <div className="p-3 border-r dark:border-[#27272A]" />
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-3 text-center border-r last:border-r-0 dark:border-[#27272A]",
                  isToday(day) && "bg-indigo-50 dark:bg-indigo-500/10"
                )}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  {day.toLocaleDateString('es-AR', { weekday: 'short' })}
                </div>
                <div className={cn(
                  "text-lg font-semibold mt-1",
                  isToday(day) && "text-indigo-600 dark:text-indigo-400"
                )}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-8 max-h-[calc(100vh-300px)] overflow-y-auto">
            {HOURS.map((hour) => (
              <div key={hour} className="contents">
                {/* Hour Column */}
                <div className="p-2 border-r border-b text-xs text-gray-400 dark:text-gray-500 text-right pr-3 sticky left-0 bg-white dark:bg-[#141416]">
                  {formatHour(hour)}
                </div>
                
                {/* Day Columns */}
                {weekDays.map((day, dayIndex) => {
                  const dayTasks = getTasksForHour(day, hour);
                  const isCurrentHour = isToday(day) && new Date().getHours() === hour;
                  
                  return (
                    <div 
                      key={dayIndex}
                      className={cn(
                        "min-h-[60px] border-r border-b last:border-r-0 dark:border-[#27272A] p-1 relative",
                        isToday(day) && "bg-indigo-50/30 dark:bg-indigo-500/5"
                      )}
                    >
                      {isCurrentHour && (
                        <div className="absolute left-0 right-0 top-0 h-0.5 bg-indigo-500 z-10" />
                      )}
                      
                      {dayTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "text-xs p-1.5 rounded mb-1 cursor-pointer hover:opacity-90 transition-opacity",
                            PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.MEDIUM,
                            task.completed && "opacity-50 line-through"
                          )}
                        >
                          <div className="font-medium truncate">
                            {CATEGORY_ICONS[task.category] || '📌'} {task.title}
                          </div>
                          {task.assignedTo && (
                            <div className="text-[10px] opacity-75 truncate">
                              👤 {task.assignedTo}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 dark:bg-[#141416] dark:border-[#27272A]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Próximas tareas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : tasks.filter(t => t.dueDate && !t.completed).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
                No hay tareas pendientes
              </p>
            ) : (
              tasks
                .filter(t => t.dueDate && !t.completed)
                .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                .slice(0, 10)
                .map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#1C1C1F] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors cursor-pointer"
                  >
                    <div className="text-xl">
                      {CATEGORY_ICONS[task.category] || '📌'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {task.dueDate && new Date(task.dueDate).toLocaleString('es-AR', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {task.assignedTo && (
                          <>
                            <span>•</span>
                            <Users className="h-3 w-3" />
                            {task.assignedTo}
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className={PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || ''}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="dark:bg-[#141416] dark:border-[#27272A]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total tareas</span>
              <span className="font-semibold text-gray-900 dark:text-white">{tasks.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completadas</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {tasks.filter(t => t.completed).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Pendientes</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {tasks.filter(t => !t.completed).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Urgentes</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {tasks.filter(t => t.priority === 'HIGH' && !t.completed).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
