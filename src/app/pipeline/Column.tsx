'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ContactCard } from './ContactCard';
import { Contact, Column as ColumnType } from './types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ColumnProps {
  column: ColumnType;
  contacts: Contact[];
  onContactClick?: (contact: Contact) => void;
}

export function Column({ column, contacts, onContactClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-64 sm:w-72 bg-gray-50 dark:bg-[#141416] rounded-lg border transition-all",
        isOver ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10" : "border-gray-200 dark:border-[#27272A]",
        isCollapsed ? "w-auto" : ""
      )}
    >
      <div 
        className={cn(
          "p-3 border-b rounded-t-lg cursor-pointer flex items-center justify-between",
          column.color,
          isCollapsed && "rounded-lg"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">{column.title}</h3>
          <span className="bg-white/20 text-white text-sm px-2 py-0.5 rounded-full">
            {contacts.length}
          </span>
        </div>
        {isCollapsed && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="p-2 space-y-2 min-h-[150px] max-h-[calc(100vh-250px)] overflow-y-auto">
          <SortableContext 
            items={contacts.map(c => c.id)} 
            strategy={verticalListSortingStrategy}
          >
            {contacts.map(contact => (
              <ContactCard 
                key={contact.id} 
                contact={contact} 
                onClick={() => onContactClick?.(contact)}
              />
            ))}
          </SortableContext>
          
          {contacts.length === 0 && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
              Sin contactos
            </div>
          )}
        </div>
      )}
    </div>
  );
}
