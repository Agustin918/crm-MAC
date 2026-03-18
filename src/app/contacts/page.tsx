'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ContactActions } from "@/components/ContactActions";
import { deleteContact } from "@/actions/contacts";
import Link from "next/link";
import { motion } from 'framer-motion';
import { Filter, ArrowUpDown, Ruler, DollarSign, Trash2, Eye, AlertTriangle, Home, Building, Briefcase, Palette } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  meters: number | null;
  description: string | null;
  value: number | null;
  status: string;
  createdAt: string;
  tipologia: string | null;
  lastInteractionAt: string | null;
  source: string | null;
}

const STATUSES = [
  { value: 'all', label: 'Todos' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'CONTACTED', label: 'Contactado' },
  { value: 'MEETING', label: 'Reunión' },
  { value: 'QUALIFIED', label: 'Calificado' },
  { value: 'QUOTE', label: 'Presupuestado' },
  { value: 'WON', label: 'Ganado' },
  { value: 'LOST', label: 'Perdido' },
];

const ORIGINS = [
  { value: 'Facebook Ads', label: 'Facebook Ads', icon: '📘' },
  { value: 'Instagram', label: 'Instagram', icon: '📸' },
  { value: 'Referido', label: 'Referido', icon: '👤' },
  { value: 'Orgánico', label: 'Orgánico', icon: '🔍' },
  { value: 'Google', label: 'Google', icon: '🔵' },
];

const getOriginLabel = (source: string | null) => {
  if (!source) return '-';
  const origin = ORIGINS.find(o => o.value === source);
  return origin ? origin.label : source;
};

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'az', label: 'A - Z' },
  { value: 'za', label: 'Z - A' },
];

const TIPOLOGIAS = [
  { value: 'Reforma', label: 'Reforma', icon: Home },
  { value: 'Vivienda Unifamiliar', label: 'Vivienda Unifamiliar', icon: Building },
  { value: 'Comercial', label: 'Comercial', icon: Briefcase },
  { value: 'Interiorismo', label: 'Interiorismo', icon: Palette },
];

const getTipologiaIcon = (tipologia: string | null) => {
  const t = TIPOLOGIAS.find(tip => tip.value === tipologia);
  const Icon = t?.icon || Home;
  return <Icon className="h-3 w-3" />;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este contacto?')) return;
    try {
      await fetch('/api/contacts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setContacts(contacts.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'LOST': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'LEAD': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'MEETING': return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400';
      case 'QUALIFIED': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'QUOTE': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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

  const needsFollowUp = (contact: Contact) => {
    if (contact.status === 'WON' || contact.status === 'LOST') return false;
    if (!contact.lastInteractionAt) return true;
    const daysSinceInteraction = Math.floor((Date.now() - new Date(contact.lastInteractionAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceInteraction > 7;
  };

  const filteredContacts = contacts
    .filter(c => statusFilter === 'all' || c.status === statusFilter)
    .filter(c => sourceFilter === '' || c.source === sourceFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'az': return a.name.localeCompare(b.name);
        case 'za': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

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
          <h2 className="text-2xl font-bold tracking-tight">Contactos</h2>
          <p className="text-muted-foreground">{contacts.length} contactos en total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/capture">Vista Cliente</Link>
          </Button>
          <Button asChild>
            <Link href="/contacts/new">Agregar Contacto</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-sm border rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">Todos los orígenes</option>
            {ORIGINS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            {SORT_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900">
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Nombre</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Teléfono</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Tipología</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100">m²</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Valor Est.</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Estado</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Origen</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Fecha</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-right pr-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No hay contactos
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <motion.tr
                  key={contact.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      {contact.name}
                      {needsFollowUp(contact) && (
                        <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Seguimiento
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{contact.phone || '-'}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {contact.tipologia ? (
                      <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        {getTipologiaIcon(contact.tipologia)}
                        <span>{contact.tipologia}</span>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {contact.meters ? (
                      <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        <Ruler className="h-3 w-3" />
                        <span>{contact.meters} m²</span>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {contact.value ? (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <DollarSign className="h-3 w-3" />
                        <span>${contact.value.toLocaleString()}</span>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(contact.status)}`}>
                      {getStatusLabel(contact.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                    {getOriginLabel(contact.source)}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                    {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ContactActions 
                        name={contact.name} 
                        email={contact.email}
                        phone={contact.phone || undefined}
                        status={contact.status}
                      />
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
