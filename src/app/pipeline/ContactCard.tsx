'use client';

import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ContactActions } from '@/components/ContactActions';
import { Contact } from './types';
import { Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactCardProps {
  contact: Contact;
  isOverlay?: boolean;
  onClick?: () => void;
}

export function ContactCard({ contact, isOverlay, onClick }: ContactCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'LOST': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'LEAD': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'CONTACTED': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'MEETING': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'QUALIFIED': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'QUOTE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'WON': return 'Ganado';
      case 'LOST': return 'Perdido';
      case 'LEAD': return 'Lead';
      case 'CONTACTED': return 'Contactado';
      case 'MEETING': return 'Reunión';
      case 'QUALIFIED': return 'Calificado';
      case 'QUOTE': return 'Presupuestado';
      default: return status;
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-[#141416] rounded-lg border border-gray-200 dark:border-[#27272A] p-3 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400",
        isDragging && "opacity-50",
        isOverlay && "shadow-xl rotate-2"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-sm truncate text-gray-900 dark:text-white">
              {contact.name}
            </h4>
            <span className={cn("text-xs px-2 py-0.5 rounded-full border", getStatusColor(contact.status))}>
              {getStatusLabel(contact.status)}
            </span>
          </div>
          
          {contact.meters && (
            <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              <Ruler className="h-3 w-3" />
              <span>{contact.meters} m²</span>
            </div>
          )}
          
          {contact.email && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.email}</p>
          )}
          
          {contact.phone && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.phone}</p>
          )}
          
          {contact.value && (
            <div className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              ${contact.value.toLocaleString()}
            </div>
          )}
          
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <ContactActions 
              name={contact.name} 
              email={contact.email}
              phone={contact.phone || undefined}
              meters={contact.meters}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
