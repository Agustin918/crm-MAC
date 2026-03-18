'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CrmButton } from '@/components/ui/crm-button';
import Link from "next/link";
import { ArrowLeft, Save, Mail, Phone, Ruler, FileText, DollarSign, Home, Building, Briefcase, Palette, Calculator } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

const STATUSES = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'CONTACTED', label: 'Contactado' },
  { value: 'QUALIFIED', label: 'Calificado' },
  { value: 'QUOTE', label: 'Presupuestado' },
  { value: 'WON', label: 'Ganado' },
  { value: 'LOST', label: 'Perdido' },
];

const TIPOLOGIAS = [
  { value: 'Reforma', label: 'Reforma' },
  { value: 'Vivienda Unifamiliar', label: 'Vivienda Unifamiliar' },
  { value: 'Comercial', label: 'Comercial' },
  { value: 'Interiorismo', label: 'Interiorismo' },
];

const ORIGINS = [
  { value: 'Facebook Ads', label: 'Facebook Ads' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referido', label: 'Referido' },
  { value: 'Orgánico', label: 'Orgánico' },
  { value: 'Google', label: 'Google' },
];

export default function NewContactPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    meters: '',
    description: '',
    value: '',
    status: 'LEAD',
    tipologia: '',
    costoM2: '',
    porcentajeHonorarios: '',
    source: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          meters: formData.meters ? parseFloat(formData.meters) : null,
          description: formData.description,
          value: formData.value ? parseFloat(formData.value) : null,
          status: formData.status,
          tipologia: formData.tipologia || null,
          costoM2: formData.costoM2 ? parseFloat(formData.costoM2) : null,
          porcentajeHonorarios: formData.porcentajeHonorarios ? parseFloat(formData.porcentajeHonorarios) : null,
          source: formData.source || 'manual'
        })
      });

      if (res.ok) {
        router.push('/contacts');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nuevo Contacto</h2>
          <p className="text-muted-foreground">Ingresa los datos del nuevo lead.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/contacts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input 
              id="name" 
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input 
                id="email" 
                type="email"
                placeholder="juan@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input 
                id="phone" 
                type="tel"
                placeholder="+54 9 11 1234 5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required 
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipologia">Tipología</Label>
            <Select value={formData.tipologia || ''} onValueChange={(v) => v && setFormData({ ...formData, tipologia: v })}>
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue placeholder="Seleccionar tipología" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {TIPOLOGIAS.map(t => (
                  <SelectItem key={t.value} value={t.value} className="dark:text-gray-100">{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meters">Metros cuadrados</Label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input 
                id="meters" 
                type="number"
                placeholder="150"
                value={formData.meters}
                onChange={(e) => setFormData({ ...formData, meters: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="costoM2">Costo m² ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
              <Input 
                id="costoM2" 
                type="number"
                placeholder="1500"
                value={formData.costoM2}
                onChange={(e) => setFormData({ ...formData, costoM2: e.target.value })}
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="porcentajeHonorarios">% Honorarios</Label>
            <div className="relative">
              <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
              <Input 
                id="porcentajeHonorarios" 
                type="number"
                placeholder="10"
                value={formData.porcentajeHonorarios}
                onChange={(e) => setFormData({ ...formData, porcentajeHonorarios: e.target.value })}
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Valor Estimado</Label>
            <div className="h-10 flex items-center px-3 bg-white dark:bg-gray-800 rounded-md border text-indigo-600 dark:text-indigo-400 font-medium">
              {formData.meters && formData.costoM2 && formData.porcentajeHonorarios 
                ? `$${((parseFloat(formData.meters) * parseFloat(formData.costoM2)) * (parseFloat(formData.porcentajeHonorarios) / 100)).toLocaleString()}`
                : '—'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción del proyecto</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Textarea 
              id="description" 
              placeholder="¿Qué tipo de vivienda buscás? ¿En qué zona? ¿Tenés algún estilo preferido?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="pl-10 min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado inicial</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800"
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Origen del lead</Label>
          <select
            id="source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800"
          >
            <option value="">Seleccionar origen</option>
            {ORIGINS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <CrmButton type="button" variant="outline" asChild>
            <Link href="/contacts">Cancelar</Link>
          </CrmButton>
          <CrmButton 
            type="submit" 
            disabled={isLoading}
            loading={isLoading}
          >
            <Save className="h-4 w-4" />
            Guardar Contacto
          </CrmButton>
        </div>
      </motion.form>
    </div>
  );
}
