'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  X, Phone, Mail, MessageSquare, Trash2, Edit2, DollarSign,
  Calendar, Ruler, FileText, Clock, CheckCircle, Plus, Upload, History
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  meters: number | null;
  description: string | null;
  value: number | null;
  status: string;
  notes: string | null;
  source: string | null;
  tipologia: string | null;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  interactions?: Interaction[];
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

interface Interaction {
  id: string;
  type: string;
  content: string;
  createdAt: string;
}

interface ContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Contact>) => void;
  onDelete: (id: string) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
}

const STATUSES = [
  { value: 'LEAD', label: 'Lead', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'CONTACTED', label: 'Contactado', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'MEETING', label: 'Reunión', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  { value: 'QUALIFIED', label: 'Calificado', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 'QUOTE', label: 'Presupuestado', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'WON', label: 'Ganado', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'LOST', label: 'Perdido', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
];

const TABS = [
  { id: 'datos', label: 'Datos' },
  { id: 'notas', label: 'Notas' },
  { id: 'tareas', label: 'Tareas' },
  { id: 'archivos', label: 'Archivos' },
  { id: 'historial', label: 'Historial' },
];

export function ContactModal({ contact, isOpen, onClose, onUpdate, onDelete, onToggleTask }: ContactModalProps) {
  const [activeTab, setActiveTab] = useState('datos');
  const [isEditing, setIsEditing] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'MEDIUM' });
  const [editData, setEditData] = useState({
    value: '',
    notes: '',
    status: ''
  });

  useEffect(() => {
    if (contact) {
      setEditData({
        value: contact.value?.toString() || '',
        notes: contact.notes || '',
        status: contact.status
      });
      setActiveTab('datos');
    }
  }, [contact]);

  if (!contact) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    return STATUSES.find(s => s.value === status)?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusLabel = (status: string) => {
    return STATUSES.find(s => s.value === status)?.label || status;
  };

  const handleSave = () => {
    onUpdate(contact.id, {
      value: editData.value ? parseFloat(editData.value) : null,
      notes: editData.notes,
      status: editData.status
    });
    setIsEditing(false);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          contactId: contact.id,
          dueDate: newTask.dueDate || null,
          priority: newTask.priority
        })
      });
      if (res.ok) {
        setShowNewTask(false);
        setNewTask({ title: '', dueDate: '', priority: 'MEDIUM' });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getWhatsAppLink = () => {
    if (!contact.phone) return '#';
    const message = encodeURIComponent(`Hola ${contact.name.split(' ')[0]}, te contacto de A7 Estudio.\n\n¿cómo estás? ¿Te parece si hablamos sobre tu proyecto?`);
    return `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${message}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'datos':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Teléfono</Label>
                <p className="font-medium">{contact.phone || '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Email</Label>
                <p className="font-medium">{contact.email || '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Tipología</Label>
                <p className="font-medium">{contact.tipologia || '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Origen</Label>
                <p className="font-medium">{contact.source || '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">m²</Label>
                <p className="font-medium">{contact.meters ? `${contact.meters} m²` : '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Fecha ingreso</Label>
                <p className="font-medium">{formatDate(contact.createdAt)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-gray-500">Valor estimado</Label>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={editData.value}
                    onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                    className="flex-1"
                    placeholder="$0"
                  />
                </div>
              ) : (
                <p className="text-2xl font-bold text-emerald-500">
                  {contact.value ? `$${contact.value.toLocaleString()}` : 'Sin valor'}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-gray-500">Estado</Label>
              </div>
              {isEditing ? (
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 bg-gray-800 border-gray-700"
                >
                  {STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              ) : (
                <Badge className={cn("border", getStatusColor(contact.status))}>
                  {getStatusLabel(contact.status)}
                </Badge>
              )}
            </div>

            {contact.description && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Label className="text-xs text-gray-500 mb-2 block">Descripción</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{contact.description}</p>
              </div>
            )}
          </div>
        );

      case 'notas':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                placeholder="Agregar nota rápida..."
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleSave} size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-1" />
              Guardar nota
            </Button>
            {contact.notes && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm">{contact.notes}</p>
              </div>
            )}
          </div>
        );

      case 'tareas':
        return (
          <div className="space-y-3">
            {!showNewTask ? (
              <Button variant="outline" size="sm" className="w-full" onClick={() => setShowNewTask(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Nueva tarea
              </Button>
            ) : (
              <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3">
                <Input
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="bg-white dark:bg-gray-900"
                />
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="bg-white dark:bg-gray-900"
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="border rounded px-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                  >
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowNewTask(false)} className="flex-1">Cancelar</Button>
                  <Button size="sm" onClick={handleCreateTask} className="flex-1 bg-indigo-600">Crear</Button>
                </div>
              </div>
            )}
            {contact.tasks && contact.tasks.length > 0 ? (
              <div className="space-y-2">
                {contact.tasks.map(task => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border",
                      task.completed 
                        ? "bg-gray-50 dark:bg-gray-800 opacity-60" 
                        : "bg-white dark:bg-gray-900"
                    )}
                  >
                    <button
                      onClick={() => onToggleTask(task.id, task.completed)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        task.completed ? "border-green-500 bg-green-500" : "border-gray-300"
                      )}
                    >
                      {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                    </button>
                    <span className={cn("flex-1 text-sm", task.completed && "line-through")}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No hay tareas</p>
            )}
          </div>
        );

      case 'archivos':
        return (
          <div className="space-y-4">
            <Button variant="outline" size="sm" className="w-full">
              <Upload className="h-4 w-4 mr-1" />
              Subir archivo
            </Button>
            <p className="text-center text-gray-500 text-sm py-4">
              Arrastra archivos o haz click para subir
            </p>
          </div>
        );

      case 'historial':
        return (
          <div className="space-y-3">
            {contact.interactions && contact.interactions.length > 0 ? (
              contact.interactions.map(interaction => (
                <div key={interaction.id} className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{interaction.type}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{interaction.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(interaction.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Sin historial</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-[#141416] border-gray-200 dark:border-[#27272A]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-4 border-white/30">
                      <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
                      <p className="text-white/80 text-sm">
                        Creado {formatDate(contact.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 py-3 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "text-indigo-500 border-b-2 border-indigo-500"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto">
                {renderTabContent()}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                {contact.phone && (
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
                {isEditing && (
                  <Button onClick={handleSave} className="flex-1 bg-indigo-500 hover:bg-indigo-600">
                    Guardar
                  </Button>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
