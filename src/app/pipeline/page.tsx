'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Column } from './Column';
import { ContactCard } from './ContactCard';
import { ContactModal } from '@/components/ContactModal';
import { Contact, Column as ColumnType } from './types';
import { CrmButton, IconButton } from '@/components/ui/crm-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, Settings, X, Edit2, Trash2, GripVertical, Lock 
} from 'lucide-react';

const FIXED_COLUMNS = [
  { id: 'LEAD', name: 'Lead', title: 'Lead', color: 'bg-blue-500', order: 0, fixed: true },
  { id: 'CONTACTED', name: 'Contactado', title: 'Contactado', color: 'bg-yellow-500', order: 1, fixed: true },
  { id: 'MEETING', name: 'Reunión', title: 'Reunión', color: 'bg-cyan-500', order: 2, fixed: true },
  { id: 'QUALIFIED', name: 'Calificado', title: 'Calificado', color: 'bg-orange-500', order: 3, fixed: true },
  { id: 'QUOTE', name: 'Presupuestado', title: 'Presupuestado', color: 'bg-purple-500', order: 4, fixed: true },
  { id: 'WON', name: 'Ganado', title: 'Ganado', color: 'bg-green-500', order: 5, fixed: true },
  { id: 'LOST', name: 'Perdido', title: 'Perdido', color: 'bg-red-500', order: 6, fixed: true },
];

const COLORS = [
  { value: 'bg-blue-500', label: 'Azul' },
  { value: 'bg-yellow-500', label: 'Amarillo' },
  { value: 'bg-cyan-500', label: 'Cian' },
  { value: 'bg-orange-500', label: 'Naranja' },
  { value: 'bg-purple-500', label: 'Morado' },
  { value: 'bg-green-500', label: 'Verde' },
  { value: 'bg-red-500', label: 'Rojo' },
  { value: 'bg-pink-500', label: 'Rosa' },
  { value: 'bg-indigo-500', label: 'Índigo' },
];

export default function PipelinePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);
  const [newColumn, setNewColumn] = useState({ name: '', color: 'bg-blue-500' });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const contactsRes = await fetch('/api/contacts');
      const contactsData = await contactsRes.json();
      
      let customCols: any[] = [];
      try {
        const columnsRes = await fetch('/api/pipeline/columns');
        const columnsData = await columnsRes.json();
        customCols = columnsData.map((c: any) => ({ 
          id: c.id, 
          name: c.name, 
          color: c.color, 
          order: c.order + FIXED_COLUMNS.length, 
          title: c.name,
          fixed: false 
        }));
      } catch (e) {
        console.log('Using default columns');
      }
      
      const contactsArray = contactsData?.data || contactsData || [];
      setContacts(contactsArray);
      setColumns([...FIXED_COLUMNS, ...customCols]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setContacts([]);
      setColumns(FIXED_COLUMNS);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data?.data || data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const contactsByColumn = useMemo(() => {
    const grouped: Record<string, Contact[]> = {};
    columns.forEach(col => {
      grouped[col.id] = contacts.filter(c => c.status === col.id);
    });
    return grouped;
  }, [contacts, columns]);

  const getContactsByColumn = useCallback((columnId: string) => {
    return contactsByColumn[columnId] || [];
  }, [contactsByColumn]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContact = contacts.find(c => c.id === active.id);
    if (!activeContact) return;

    const overId = over.id as string;
    const isColumn = columns.find(c => c.id === overId);
    
    let newStatus = activeContact.status;
    if (isColumn) {
      newStatus = overId;
    } else {
      const overContact = contacts.find(c => c.id === overId);
      if (overContact) {
        newStatus = overContact.status;
      }
    }

    if (newStatus !== activeContact.status) {
      setContacts(prev => 
        prev.map(c => 
          c.id === active.id ? { ...c, status: newStatus } : c
        )
      );

      try {
        await fetch('/api/contacts/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: active.id, status: newStatus })
        });
      } catch (error) {
        console.error('Error updating status:', error);
        fetchContacts();
      }
    }
  };

  const handleUpdateContact = async (id: string, data: Partial<Contact>) => {
    try {
      await fetch('/api/contacts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este contacto?')) return;
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const createColumn = async () => {
    if (!newColumn.name.trim()) return;
    try {
      const res = await fetch('/api/pipeline/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newColumn)
      });
      const column = await res.json();
      setColumns([...columns, { ...column, title: column.name }]);
      setNewColumn({ name: '', color: 'bg-blue-500' });
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  const updateColumn = async () => {
    if (!editingColumn) return;
    try {
      await fetch(`/api/pipeline/columns/${editingColumn.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingColumn.name, color: editingColumn.color })
      });
      setColumns(columns.map(c => c.id === editingColumn.id ? { ...c, name: editingColumn.name, title: editingColumn.name, color: editingColumn.color } : c));
      setEditingColumn(null);
    } catch (error) {
      console.error('Error updating column:', error);
    }
  };

  const deleteColumn = async (id: string) => {
    const column = columns.find(c => c.id === id);
    if (column?.fixed) {
      alert('Las casillas fijas no pueden eliminarse');
      return;
    }
    if (!confirm('¿Eliminar esta casilla? Los contactos en esta casilla perderán su estado.')) return;
    try {
      await fetch(`/api/pipeline/columns/${id}`, { method: 'DELETE' });
      setColumns(columns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const activeContact = activeId ? contacts.find(c => c.id === activeId) : null;

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
          <h2 className="text-2xl font-bold tracking-tight">Pipeline</h2>
          <p className="text-muted-foreground">Gestiona tus leads y clientes. Haz click en un contacto para ver detalles.</p>
        </div>
        <CrmButton variant="outline" onClick={() => setShowSettings(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Gestionar casillas
        </CrmButton>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4 px-1 -mx-1 min-w-[100vw] md:min-w-0">
          {columns.map(column => {
            const columnContacts = getContactsByColumn(column.id);
            return (
              <Column
                key={column.id}
                column={column}
                contacts={columnContacts}
                onContactClick={handleContactClick}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeContact ? <ContactCard contact={activeContact} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <ContactModal
        contact={selectedContact}
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        onUpdate={handleUpdateContact}
        onDelete={handleDeleteContact}
        onToggleTask={async (taskId: string, completed: boolean) => {
          try {
            await fetch('/api/tasks/toggle', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: taskId, completed: !completed })
            });
            fetchContacts();
          } catch (error) {
            console.error('Error toggling task:', error);
          }
        }}
      />

      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Gestionar Casillas</h3>
                <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Label className="text-sm font-medium mb-2 block">Nueva casilla</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nombre"
                      value={newColumn.name}
                      onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                      className="flex-1"
                    />
                    <select
                      value={newColumn.color}
                      onChange={(e) => setNewColumn({ ...newColumn, color: e.target.value })}
                      className="border rounded-md px-2"
                    >
                      {COLORS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <IconButton size="icon" onClick={createColumn}>
                      <Plus className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>

                <div className="space-y-2">
                  {columns.map(column => (
                    <div key={column.id} className={`flex items-center gap-2 p-2 border rounded-lg ${column.fixed ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
                      <div className={`w-4 h-4 rounded ${column.color}`}></div>
                      {editingColumn?.id === column.id ? (
                        <>
                          <Input
                            value={editingColumn.name}
                            onChange={(e) => setEditingColumn({ ...editingColumn, name: e.target.value })}
                            className="flex-1 h-8"
                          />
                          <select
                            value={editingColumn.color}
                            onChange={(e) => setEditingColumn({ ...editingColumn, color: e.target.value })}
                            className="border rounded px-1 h-8"
                          >
                            {COLORS.map(c => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                          <CrmButton size="sm" onClick={updateColumn}>Guardar</CrmButton>
                          <CrmButton size="sm" variant="ghost" onClick={() => setEditingColumn(null)}>X</CrmButton>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 font-medium">{column.name}</span>
                          {column.fixed ? (
                            <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          ) : (
                            <>
                              <button onClick={() => setEditingColumn(column)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                <Edit2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                              </button>
                              <button onClick={() => deleteColumn(column.id)} className="p-1 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
