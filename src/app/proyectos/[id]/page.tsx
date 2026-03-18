'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, FolderKanban, DollarSign, Ruler, Clock, 
  CheckCircle, Pause, XCircle, Upload, Plus, Trash2, Edit2,
  FileText, History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Fase {
  id: string;
  nombre: string;
  estado: string;
  porcentajeAvance: number;
}

interface Archivo {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  createdAt: string;
}

interface HistorialEntry {
  id: string;
  tipo: string;
  descripcion: string;
  createdAt: string;
}

interface Contacto {
  name: string;
  phone: string;
  email: string;
}

interface Proyecto {
  id: string;
  nombre: string;
  estado: string;
  faseActual: string;
  m2: number | null;
  valorEstimado: number | null;
  honorariosTotal: number;
  honorariosCobrados: number;
  metadata: string | null;
  contacto: Contacto;
  fases: Fase[];
  archivos: Archivo[];
  historial: HistorialEntry[];
  createdAt: string;
}

const ESTADO_OPTIONS = [
  { value: 'ACTIVO', label: 'Activo', color: 'bg-green-500' },
  { value: 'PAUSADO', label: 'Pausado', color: 'bg-yellow-500' },
  { value: 'FINALIZADO', label: 'Finalizado', color: 'bg-gray-500' },
];

const FASE_OPTIONS = [
  { value: 'ANTEPROYECTO', label: 'Anteproyecto', color: 'bg-blue-500' },
  { value: 'PROYECTO', label: 'Proyecto', color: 'bg-indigo-500' },
  { value: 'DOCUMENTACION', label: 'Documentación', color: 'bg-purple-500' },
  { value: 'OBRA', label: 'Obra', color: 'bg-orange-500' },
];

const ARCHIVO_TIPOS = [
  { value: 'presupuesto', label: 'Presupuesto' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'plano', label: 'Plano' },
  { value: 'render', label: 'Render' },
  { value: 'otro', label: 'Otro' },
];

export default function ProyectoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('resumen');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<{file: File, tipo: string} | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchProyecto();
    }
  }, [params.id]);

  const fetchProyecto = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/proyectos/${params.id}`);
      const data = await res.json();
      if (data.data) {
        setProyecto(data.data);
      }
    } catch (error) {
      console.error('Error fetching proyecto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProyecto = async (updates: Partial<Proyecto>) => {
    if (!proyecto) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/proyectos/${proyecto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.data) {
        setProyecto(data.data);
      }
    } catch (error) {
      console.error('Error updating proyecto:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({ file, tipo: 'otro' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !proyecto) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile.file);
    formData.append('proyectoId', proyecto.id);
    formData.append('tipo', selectedFile.tipo);
    formData.append('nombre', selectedFile.file.name);

    try {
      const res = await fetch('/api/proyectos/archivos', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fetchProyecto();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Proyecto no encontrado</p>
        <Link href="/proyectos">
          <Button variant="outline">Volver a Proyectos</Button>
        </Link>
      </div>
    );
  }

  const progress = proyecto.honorariosTotal > 0 
    ? (proyecto.honorariosCobrados / proyecto.honorariosTotal) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/proyectos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {proyecto.nombre}
            </h2>
            <Badge className={`${ESTADO_OPTIONS.find(e => e.value === proyecto.estado)?.color} text-white`}>
              {ESTADO_OPTIONS.find(e => e.value === proyecto.estado)?.label}
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {proyecto.contacto.name} • {proyecto.contacto.phone}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="fases">Fases</TabsTrigger>
          <TabsTrigger value="archivos">Archivos</TabsTrigger>
          <TabsTrigger value="finanzas">Finanzas</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Fase Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={proyecto.faseActual} 
                  onValueChange={(value) => updateProyecto({ faseActual: value || proyecto.faseActual })}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    {FASE_OPTIONS.map(f => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={proyecto.estado} 
                  onValueChange={(value) => updateProyecto({ estado: value || proyecto.estado })}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    {ESTADO_OPTIONS.map(e => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Metros²</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={proyecto.m2 ?? ''}
                  onChange={(e) => updateProyecto({ m2: parseFloat(e.target.value) || null })}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  placeholder="0"
                />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Valor Estimado</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={proyecto.valorEstimado ?? ''}
                  onChange={(e) => updateProyecto({ valorEstimado: parseFloat(e.target.value) || null })}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  placeholder="0"
                />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Progressión de Honorarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Cobrado</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${proyecto.honorariosCobrados.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    ${proyecto.honorariosTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fases" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {proyecto.fases.map((fase) => (
              <Card 
                key={fase.id} 
                className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${
                  fase.nombre === proyecto.faseActual ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {FASE_OPTIONS.find(f => f.value === fase.nombre)?.label}
                    </CardTitle>
                    {fase.estado === 'TERMINADO' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {fase.estado === 'EN_PROGRESO' && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    {fase.estado === 'PENDIENTE' && (
                      <Pause className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Avance</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{fase.porcentajeAvance}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          fase.estado === 'TERMINADO' ? 'bg-green-500' :
                          fase.estado === 'EN_PROGRESO' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${fase.porcentajeAvance}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archivos" className="space-y-4 mt-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">Archivos del Proyecto</CardTitle>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                />
                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Archivo
                </Button>
              </div>
            </CardHeader>
             <CardContent>
               {selectedFile && (
                 <div className="mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-900 dark:text-gray-100">{selectedFile.file.name}</span>
                     <select
                       value={selectedFile.tipo}
                       onChange={(e) => setSelectedFile({ ...selectedFile, tipo: e.target.value })}
                       className="ml-2 border rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 dark:border-gray-700"
                     >
                       {ARCHIVO_TIPOS.map(t => (
                         <option key={t.value} value={t.value}>{t.label}</option>
                       ))}
                     </select>
                   </div>
                   <div className="flex gap-2 mt-2">
                     <Button size="sm" variant="outline" onClick={() => setSelectedFile(null)} className="flex-1">Cancelar</Button>
                     <Button size="sm" onClick={handleUpload} className="flex-1 bg-indigo-600">Subir</Button>
                   </div>
                 </div>
               )}
               {proyecto && proyecto.archivos.length === 0 && !selectedFile ? (
                 <div className="text-center py-8">
                   <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                   <p className="text-gray-500 dark:text-gray-400">No hay archivos</p>
                   <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                     Sube presupuestos, contratos, planos o renders
                   </p>
                 </div>
               ) : (
                 <div className="space-y-2">
                   {proyecto?.archivos.map((archivo) => (
                     <div 
                       key={archivo.id} 
                       className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                     >
                       <div className="flex items-center gap-3">
                         <FileText className="h-5 w-5 text-gray-400" />
                         <div>
                           <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                             {archivo.nombre}
                           </p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">
                             {ARCHIVO_TIPOS.find(t => t.value === archivo.tipo)?.label}
                           </p>
                         </div>
                       </div>
                       <Button variant="ghost" size="icon">
                         <Trash2 className="h-4 w-4 text-red-500" />
                       </Button>
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finanzas" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Honorarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Total</label>
                  <Input
                    type="number"
                    value={proyecto.honorariosTotal || ''}
                    onChange={(e) => updateProyecto({ honorariosTotal: parseFloat(e.target.value) || 0 })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Cobrado</label>
                  <Input
                    type="number"
                    value={proyecto.honorariosCobrados || ''}
                    onChange={(e) => updateProyecto({ honorariosCobrados: parseFloat(e.target.value) || 0 })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Valor del Proyecto</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${(proyecto.valorEstimado || 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Honorarios Totales</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${proyecto.honorariosTotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Honorarios Cobrados</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      ${proyecto.honorariosCobrados.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Por Cobrar</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        ${(proyecto.honorariosTotal - proyecto.honorariosCobrados).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historial" className="space-y-4 mt-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proyecto.historial.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No hay historial
                </p>
              ) : (
                <div className="space-y-3">
                  {proyecto.historial.map((entry) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{entry.descripcion}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(entry.createdAt).toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
