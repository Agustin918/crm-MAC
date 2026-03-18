'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderKanban, Search, DollarSign, Ruler, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

interface Proyecto {
  id: string;
  nombre: string;
  estado: string;
  faseActual: string;
  m2: number | null;
  valorEstimado: number | null;
  honorariosTotal: number;
  honorariosCobrados: number;
  contacto: {
    name: string;
    phone: string;
  };
  fases: {
    id: string;
    nombre: string;
    estado: string;
    porcentajeAvance: number;
  }[];
}

const ESTADO_COLORS: Record<string, string> = {
  ACTIVO: 'bg-green-500',
  PAUSADO: 'bg-yellow-500',
  FINALIZADO: 'bg-gray-500',
};

const FASE_COLORS: Record<string, string> = {
  ANTEPROYECTO: 'bg-blue-500',
  PROYECTO: 'bg-indigo-500',
  DOCUMENTACION: 'bg-purple-500',
  OBRA: 'bg-orange-500',
};

const FASE_LABELS: Record<string, string> = {
  ANTEPROYECTO: 'Anteproyecto',
  PROYECTO: 'Proyecto',
  DOCUMENTACION: 'Documentación',
  OBRA: 'Obra',
};

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('all');
  const [faseFilter, setFaseFilter] = useState('all');

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/proyectos');
      const data = await res.json();
      setProyectos(data.data || []);
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProyectos = proyectos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contacto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === 'all' || p.estado === estadoFilter;
    const matchesFase = faseFilter === 'all' || p.faseActual === faseFilter;
    return matchesSearch && matchesEstado && matchesFase;
  });

  const stats = {
    total: proyectos.length,
    activos: proyectos.filter(p => p.estado === 'ACTIVO').length,
    pausados: proyectos.filter(p => p.estado === 'PAUSADO').length,
    finalizados: proyectos.filter(p => p.estado === 'FINALIZADO').length,
    honorariosTotal: proyectos.reduce((sum, p) => sum + (p.honorariosTotal || 0), 0),
    honorariosCobrados: proyectos.reduce((sum, p) => sum + (p.honorariosCobrados || 0), 0),
    m2Total: proyectos.reduce((sum, p) => sum + (p.m2 || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Proyectos</h2>
          <p className="text-gray-500 dark:text-gray-400">Gestión de proyectos de arquitectura</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Total Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activos}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">m² Totales</CardTitle>
            <Ruler className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.m2Total.toLocaleString('es-AR')}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Honorarios</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${stats.honorariosCobrados.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              / ${stats.honorariosTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar proyectos..."
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={estadoFilter} onValueChange={(value) => setEstadoFilter(value || 'all')}>
          <SelectTrigger className="w-[150px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ACTIVO">Activo</SelectItem>
            <SelectItem value="PAUSADO">Pausado</SelectItem>
            <SelectItem value="FINALIZADO">Finalizado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={faseFilter} onValueChange={(value) => setFaseFilter(value || 'all')}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Fase" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectItem value="all">Todas las fases</SelectItem>
            <SelectItem value="ANTEPROYECTO">Anteproyecto</SelectItem>
            <SelectItem value="PROYECTO">Proyecto</SelectItem>
            <SelectItem value="DOCUMENTACION">Documentación</SelectItem>
            <SelectItem value="OBRA">Obra</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProyectos.length === 0 ? (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay proyectos</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Los proyectos se crean automáticamente cuando un contacto pasa a &quot;Calificado&quot;
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProyectos.map((proyecto) => {
            const faseActual = proyecto.fases.find(f => f.nombre === proyecto.faseActual);
            const progress = proyecto.honorariosTotal > 0 
              ? (proyecto.honorariosCobrados / proyecto.honorariosTotal) * 100 
              : 0;

            return (
              <Link key={proyecto.id} href={`/proyectos/${proyecto.id}`}>
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{proyecto.nombre}</h3>
                          <div className={`w-2 h-2 rounded-full ${ESTADO_COLORS[proyecto.estado]}`}></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{proyecto.contacto.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className={`${FASE_COLORS[proyecto.faseActual]} text-white`}>
                            {FASE_LABELS[proyecto.faseActual]}
                          </Badge>
                          {proyecto.m2 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {proyecto.m2} m²
                            </span>
                          )}
                          {proyecto.valorEstimado && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ${proyecto.valorEstimado.toLocaleString('es-AR')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="w-full md:w-48">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Honorarios</span>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ${proyecto.honorariosCobrados.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            ${proyecto.honorariosTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
