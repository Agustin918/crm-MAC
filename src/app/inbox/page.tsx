'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CrmButton, IconButton } from '@/components/ui/crm-button';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeInUp } from '@/lib/animation-variants';
import { 
  Plus, CheckCircle2, Phone, Mail, Calendar, FileText,
  Trash2, Edit2, Search, UserPlus, X, ChevronLeft, ChevronRight,
  Clock, AlertCircle, Inbox
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string | null;
  priority: string;
  category: string;
  completed: boolean;
  createdAt: string;
  contactId?: string;
  createdBy?: string;
  assignedTo?: string;
}

const PRIORITIES = [
  { value: 'HIGH', label: 'Alta', color: 'bg-red-500 text-white', textColor: 'text-red-400' },
  { value: 'MEDIUM', label: 'Media', color: 'bg-yellow-500 text-white', textColor: 'text-yellow-400' },
  { value: 'LOW', label: 'Baja', color: 'bg-green-500 text-white', textColor: 'text-green-400' },
];

const CATEGORIES = [
  { value: 'TASK', label: 'Tareas', icon: CheckCircle2, color: 'bg-blue-500', textColor: 'text-blue-400' },
  { value: 'CALL', label: 'Llamadas', icon: Phone, color: 'bg-green-500', textColor: 'text-green-400' },
  { value: 'MEETING', label: 'Reuniones', icon: Calendar, color: 'bg-purple-500', textColor: 'text-purple-400' },
  { value: 'EMAIL', label: 'Emails', icon: Mail, color: 'bg-orange-500', textColor: 'text-orange-400' },
  { value: 'NOTE', label: 'Notas', icon: FileText, color: 'bg-gray-500', textColor: 'text-gray-400' },
];

function MiniCalendar({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(value || Date.now()));
  
  const days = [];
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startPadding = firstDay.getDay();
  
  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const selectedDate = value ? new Date(value) : null;

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1F] rounded-lg border border-gray-200 dark:border-[#27272A] p-3">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
          <ChevronLeft className="h-4 w-4 text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((d, i) => (
          <div key={i} className="text-xs text-gray-400 py-1">{d}</div>
        ))}
        
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <button
              key={i}
              onClick={() => {
                const dateStr = formatDate(day);
                const hours = value ? value.split('T')[1]?.slice(0, 5) : '12:00';
                onChange(`${dateStr}T${hours}:00`);
              }}
              className={cn(
                "text-xs p-1 rounded hover:bg-gray-100 dark:hover:bg-[#27272A]",
                isSelected && "bg-indigo-500 text-white",
                isToday && !isSelected && "ring-1 ring-indigo-500",
                !isSelected && "text-gray-700 dark:text-gray-300"
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function InboxPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    category: 'TASK',
    assignedTo: '',
  });

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

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await fetch('/api/tasks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !completed })
      });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const createTask = async () => {
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      setShowNewTask(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        category: 'TASK',
        assignedTo: '',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask)
      });
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'completed') {
      if (!task.completed) return false;
    } else if (activeTab !== 'all') {
      if (task.completed || task.category !== activeTab) return false;
    } else {
      if (task.completed) return false;
    }
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (a.category === 'TASK' && b.category !== 'TASK') return -1;
    if (a.category !== 'TASK' && b.category === 'TASK') return 1;
    if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
    if (a.priority !== 'HIGH' && b.priority === 'HIGH') return 1;
    return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
  });

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  const getPriority = (p: string) => PRIORITIES.find(pr => pr.value === p);
  const getCategory = (c: string) => CATEGORIES.find(cat => cat.value === c);
  
  const getUrgencyColor = (dueDate: string | null, completed: boolean) => {
    if (completed) return 'border-l-gray-300 dark:border-gray-600 opacity-75';
    if (!dueDate) return 'border-l-gray-200 dark:border-gray-700';
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'border-l-red-600 bg-red-50 dark:bg-red-500/10';
    if (diffDays === 0) return 'border-l-red-600 bg-red-50 dark:bg-red-500/10';
    if (diffDays === 1) return 'border-l-orange-500 bg-orange-50 dark:bg-orange-500/10';
    if (diffDays <= 3) return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-500/10';
    if (diffDays <= 7) return 'border-l-lime-500 bg-lime-50 dark:bg-lime-500/10';
    return 'border-l-emerald-400 bg-emerald-50 dark:bg-emerald-500/5';
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const priority = getPriority(task.priority);
    const category = getCategory(task.category);
    const CategoryIcon = category?.icon || CheckCircle2;
    const urgencyClass = getUrgencyColor(task.dueDate, task.completed);
    
    return (
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className={cn(
          "bg-white dark:bg-[#141416] rounded-lg border border-gray-200 dark:border-[#27272A] p-3 hover:shadow-md transition-all border-l-4",
          urgencyClass
        )}
        onClick={() => setEditingTask(task)}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); toggleTask(task.id, task.completed); }}
            className={cn(
              "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
              task.completed 
                ? "bg-green-500 border-green-500 text-white" 
                : "border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-500/20"
            )}
          >
            {task.completed && <CheckCircle2 className="h-3 w-3" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("p-1 rounded", category?.color, "text-white")}>
                <CategoryIcon className="h-3 w-3" />
              </span>
              <span className={cn("font-medium text-sm text-gray-900 dark:text-white", task.completed && "line-through text-gray-400")}>
                {task.title}
              </span>
            </div>
            
            {task.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-xs px-1.5 py-0.5 rounded", priority?.color)}>
                {priority?.label}
              </span>
              {task.dueDate && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.dueDate).toLocaleDateString('es-AR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            
            {task.assignedTo && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <UserPlus className="h-3 w-3" />
                <span>{task.assignedTo}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h1>
          <p className="text-gray-500 dark:text-gray-400">{pendingTasks.length} pendientes • {completedTasks.length} completadas</p>
        </div>
        <CrmButton onClick={() => setShowNewTask(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo
        </CrmButton>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
            activeTab === 'all' 
              ? "bg-indigo-500 text-white" 
              : "bg-gray-100 dark:bg-[#1C1C1F] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#27272A]"
          )}
        >
          Pendientes ({pendingTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
            activeTab === 'completed' 
              ? "bg-green-500 text-white" 
              : "bg-gray-100 dark:bg-[#1C1C1F] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#27272A]"
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completadas ({completedTasks.length})
        </button>
        {CATEGORIES.filter(c => c.value !== 'NOTE').map(cat => {
          const count = pendingTasks.filter(t => t.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveTab(cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                activeTab === cat.value 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 dark:bg-[#1C1C1F] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#27272A]"
              )}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A]"
        />
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-[#1C1C1F] flex items-center justify-center">
              <Inbox className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">No hay actividades</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {activeTab === 'all' ? 'Crea tu primera tarea para comenzar' : 
               activeTab === 'completed' ? 'Las tareas completadas aparecerán aquí' :
               `No hay ${CATEGORIES.find(c => c.value === activeTab)?.label?.toLowerCase() || 'elementos'}`}
            </p>
            {activeTab === 'all' && (
              <CrmButton onClick={() => setShowNewTask(true)} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Crear primera tarea
              </CrmButton>
            )}
          </div>
        ) : (
          filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-[#27272A]">
          <button
            onClick={() => setActiveTab('completed')}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            Completadas ({completedTasks.length})
          </button>
          
          {activeTab === 'completed' && (
            <div className="space-y-2 mt-3">
              {completedTasks.slice(0, 5).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#141416] rounded-xl border border-gray-200 dark:border-[#27272A] w-full max-w-lg p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Nueva actividad</h2>
              <button onClick={() => setShowNewTask(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Título</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Qué necesitas hacer?"
                  className="mt-1 bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Tipo</Label>
                  <div className="flex gap-1 mt-1">
                    {CATEGORIES.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setNewTask({ ...newTask, category: cat.value })}
                          className={cn(
                            "flex-1 p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors",
                            newTask.category === cat.value
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20"
                              : "border-gray-200 dark:border-[#27272A] hover:border-gray-300"
                          )}
                        >
                          <Icon className={cn("h-4 w-4", cat.textColor)} />
                          <span className="text-[10px] text-gray-600 dark:text-gray-400">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Prioridad</Label>
                  <Select value={newTask.priority || 'MEDIUM'} onValueChange={(v) => v && setNewTask({ ...newTask, priority: v })}>
                    <SelectTrigger className="mt-1 bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A] text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A]">
                      {PRIORITIES.map(p => (
                        <SelectItem key={p.value} value={p.value} className="text-gray-900 dark:text-gray-100">{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Fecha</Label>
                <MiniCalendar 
                  value={newTask.dueDate} 
                  onChange={(date) => setNewTask({ ...newTask, dueDate: date })} 
                />
              </div>
              
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Asignar a</Label>
                <Input
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  placeholder="Nombre de la persona"
                  className="mt-1 bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A]"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-[#27272A]">
              <CrmButton variant="outline" onClick={() => setShowNewTask(false)} className="flex-1">
                Cancelar
              </CrmButton>
              <CrmButton onClick={createTask} className="flex-1">
                Crear
              </CrmButton>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#141416] rounded-xl border border-gray-200 dark:border-[#27272A] w-full max-w-lg p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editar actividad</h2>
              <button onClick={() => setEditingTask(null)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Título</Label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="mt-1 bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Tipo</Label>
                  <Select value={editingTask.category || 'TASK'} onValueChange={(v) => v && setEditingTask({ ...editingTask, category: v })}>
                    <SelectTrigger className="mt-1 bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A] text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A]">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value} className="text-gray-900 dark:text-gray-100">{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Prioridad</Label>
                  <Select value={editingTask.priority || 'MEDIUM'} onValueChange={(v) => v && setEditingTask({ ...editingTask, priority: v })}>
                    <SelectTrigger className="mt-1 bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A] text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A]">
                      {PRIORITIES.map(p => (
                        <SelectItem key={p.value} value={p.value} className="text-gray-900 dark:text-gray-100">{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Fecha</Label>
                <MiniCalendar 
                  value={editingTask.dueDate || ''} 
                  onChange={(date) => setEditingTask({ ...editingTask, dueDate: date })} 
                />
              </div>
              
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Asignar a</Label>
                <Input
                  value={editingTask.assignedTo || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                  className="mt-1 bg-white dark:bg-[#1C1C1F] border-gray-200 dark:border-[#27272A]"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-[#27272A]">
              <CrmButton variant="outline" onClick={() => setEditingTask(null)} className="flex-1">
                Cancelar
              </CrmButton>
              <CrmButton onClick={updateTask} className="flex-1">
                Guardar
              </CrmButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
