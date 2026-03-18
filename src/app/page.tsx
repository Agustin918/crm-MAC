'use client';

import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, PhoneCall, CheckCircle, TrendingUp, 
  Building2, Calendar, Filter, Download, RefreshCw, DollarSign,
  Ruler, Gauge, Plus, Upload, Clock, FileText
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface Stats {
  total: number;
  leads: number;
  contacted: number;
  qualified: number;
  won: number;
  lost: number;
  todayLeads: number;
  weekLeads: number;
  pipelineValue: number;
  totalM2: number;
  activeProjects: number;
  proposalsThisWeek: number;
  pendingTasks: number;
  // Project stats
  proyectosActivos: number;
  proyectosPausados: number;
  honorariosTotal: number;
  honorariosCobrados: number;
}

interface Activity {
  date: string;
  contacts: number;
  interactions: number;
}

interface TopCompany {
  name: string;
  value: number;
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0, leads: 0, contacted: 0, qualified: 0, won: 0, lost: 0, todayLeads: 0, weekLeads: 0, pipelineValue: 0, totalM2: 0, activeProjects: 0, proposalsThisWeek: 0, pendingTasks: 0, proyectosActivos: 0, proyectosPausados: 0, honorariosTotal: 0, honorariosCobrados: 0
  });
  const [contacts, setContacts] = useState<any[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [pendingTasksList, setPendingTasksList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [statusFilter, setStatusFilter] = useState('all');
  const [proyectos, setProyectos] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [period, statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contactsRes, statsRes, tasksRes, proyectosRes] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/contacts/stats'),
        fetch('/api/tasks'),
        fetch('/api/proyectos')
      ]);

      const contacts = (await contactsRes.json()).data || [];
      setContacts(contacts);
      const tasksData = (await tasksRes.json()).data || [];
      const proyectosData = (await proyectosRes.json()).data || [];
      setProyectos(proyectosData);
      const statsData = await statsRes.json().catch(() => ({}));

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      let filteredContacts = contacts;
      if (statusFilter !== 'all') {
        filteredContacts = contacts.filter((c: any) => c.status === statusFilter);
      }

      const todayContacts = contacts.filter((c: any) => 
        new Date(c.createdAt) >= today
      ).length;

      const weekContacts = contacts.filter((c: any) => 
        new Date(c.createdAt) >= weekAgo
      ).length;

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dayContacts = contacts.filter((c: any) => {
          const cDate = new Date(c.createdAt);
          return cDate.toDateString() === date.toDateString();
        }).length;
        return {
          date: date.toLocaleDateString('es-AR', { weekday: 'short' }),
          contacts: dayContacts,
          interactions: Math.floor(dayContacts * 1.5)
        };
      });

      const wonContacts = contacts.filter((c: any) => c.status === 'WON');
      const topCompaniesData = wonContacts
        .sort((a: any, b: any) => (b.value || 0) - (a.value || 0))
        .slice(0, 5)
        .map((c: any) => ({ name: c.name, value: c.value || 0 }));

      const statusDistribution = [
        { name: 'Leads', value: contacts.filter((c: any) => c.status === 'LEAD').length },
        { name: 'Contactados', value: contacts.filter((c: any) => c.status === 'CONTACTED').length },
        { name: 'Calificados', value: contacts.filter((c: any) => c.status === 'QUALIFIED').length },
        { name: 'Ganados', value: contacts.filter((c: any) => c.status === 'WON').length },
        { name: 'Perdidos', value: contacts.filter((c: any) => c.status === 'LOST').length },
      ];

      const won = contacts.filter((c: any) => c.status === 'WON').length;
      const lost = contacts.filter((c: any) => c.status === 'LOST').length;
      
      const pipelineValue = contacts
        .filter((c: any) => c.status !== 'WON' && c.status !== 'LOST' && c.value)
        .reduce((sum: number, c: any) => sum + (c.value || 0), 0);

      const totalM2 = contacts
        .filter((c: any) => c.status !== 'WON' && c.status !== 'LOST' && c.meters)
        .reduce((sum: number, c: any) => sum + (c.meters || 0), 0);

      const activeProjects = contacts
        .filter((c: any) => c.status !== 'WON' && c.status !== 'LOST')
        .length;

      const proposalsThisWeek = contacts.filter((c: any) => 
        c.status === 'QUOTE' && new Date(c.updatedAt) >= weekAgo
      ).length;

      const pendingTasks = tasksData.filter((t: any) => !t.completed).length;

      // Project stats
      const proyectosActivos = proyectosData.filter((p: any) => p.estado === 'ACTIVO').length;
      const proyectosPausados = proyectosData.filter((p: any) => p.estado === 'PAUSADO').length;
      const honorariosTotal = proyectosData.reduce((sum: number, p: any) => sum + (p.honorariosTotal || 0), 0);
      const honorariosCobrados = proyectosData.reduce((sum: number, p: any) => sum + (p.honorariosCobrados || 0), 0);

      setStats({
        total: contacts.length,
        leads: contacts.filter((c: any) => c.status === 'LEAD').length,
        contacted: contacts.filter((c: any) => c.status === 'CONTACTED').length,
        qualified: contacts.filter((c: any) => c.status === 'QUALIFIED').length,
        won,
        lost,
        todayLeads: todayContacts,
        weekLeads: weekContacts,
        pipelineValue,
        totalM2,
        activeProjects,
        proposalsThisWeek,
        pendingTasks,
        proyectosActivos,
        proyectosPausados,
        honorariosTotal,
        honorariosCobrados
      });

      setActivities(last7Days);
      setTopCompanies(topCompaniesData);
      setStatusDistribution(statusDistribution);
      setPendingTasksList(tasksData.filter((t: any) => !t.completed).slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [statusDistribution, setStatusDistribution] = useState<{name: string, value: number}[]>([]);

  const conversionRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : '0';
  const contactedRate = stats.total > 0 ? ((stats.contacted / stats.total) * 100).toFixed(1) : '0';
  
  const MAX_CAPACITY = 10;
  const capacityPercentage = Math.min((stats.activeProjects / MAX_CAPACITY) * 100, 100);
  const capacityColor = capacityPercentage > 80 ? 'text-red-600' : capacityPercentage > 50 ? 'text-yellow-600' : 'text-green-600';

  const statCards = [
    { 
      title: 'Valor Pipeline Estimado', 
      value: `$${stats.pipelineValue.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`, 
      icon: DollarSign, 
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: `${stats.activeProjects} proyectos activos`
    },
    { 
      title: 'Propuestas Enviadas', 
      value: stats.proposalsThisWeek, 
      icon: FileText, 
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      change: 'esta semana'
    },
    { 
      title: 'Tareas Pendientes', 
      value: stats.pendingTasks, 
      icon: CheckCircle, 
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      change: 'por hacer'
    },
    { 
      title: 'm² en Pipeline', 
      value: `${stats.totalM2.toLocaleString('es-AR')} m²`, 
      icon: Ruler, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      change: 'en desarrollo'
    },
    { 
      title: 'Total Leads', 
      value: stats.total, 
      icon: Users, 
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: stats.weekLeads > 0 ? `+${stats.weekLeads} esta semana` : 'sin nuevos'
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">Resumen de tu gestión de clientes</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value || '30')}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectItem value="7" className="text-gray-900 dark:text-gray-100">Últimos 7 días</SelectItem>
              <SelectItem value="30" className="text-gray-900 dark:text-gray-100">Últimos 30 días</SelectItem>
              <SelectItem value="90" className="text-gray-900 dark:text-gray-100">Últimos 90 días</SelectItem>
              <SelectItem value="all" className="text-gray-900 dark:text-gray-100">Todo el tiempo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectItem value="all" className="text-gray-900 dark:text-gray-100">Todos los estados</SelectItem>
              <SelectItem value="LEAD" className="text-gray-900 dark:text-gray-100">Leads</SelectItem>
              <SelectItem value="CONTACTED" className="text-gray-900 dark:text-gray-100">Contactados</SelectItem>
              <SelectItem value="QUALIFIED" className="text-gray-900 dark:text-gray-100">Calificados</SelectItem>
              <SelectItem value="WON" className="text-gray-900 dark:text-gray-100">Ganados</SelectItem>
              <SelectItem value="LOST" className="text-gray-900 dark:text-gray-100">Perdidos</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Link href="/contacts/new" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Lead
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
        <Card className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-purple-600 to-purple-800 border-none text-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Valor Pipeline</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">${stats.pipelineValue.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
            <p className="text-sm text-purple-200 mt-1">{stats.activeProjects} proyectos activos</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Proyectos</CardTitle>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-gray-800">
              <Gauge className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.activeProjects}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">en pipeline</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Propuestas</CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-gray-800">
              <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.proposalsThisWeek}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Tareas</CardTitle>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-gray-800">
              <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingTasks}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">pendientes</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">m²</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-gray-800">
              <Ruler className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalM2.toLocaleString('es-AR')}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">en desarrollo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100 flex items-center justify-between">
              Pipeline
              <Link href="/pipeline" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Ver completo →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['LEAD', 'CONTACTED', 'MEETING', 'QUALIFIED', 'QUOTE', 'WON'].map(status => {
                const count = contacts.filter((c: any) => c.status === status).length;
                const colors: Record<string, string> = {
                  LEAD: 'bg-blue-500',
                  CONTACTED: 'bg-yellow-500',
                  MEETING: 'bg-violet-500',
                  QUALIFIED: 'bg-orange-500',
                  QUOTE: 'bg-purple-500',
                  WON: 'bg-green-500',
                };
                const labels: Record<string, string> = {
                  LEAD: 'Lead',
                  CONTACTED: 'Contactado',
                  MEETING: 'Reunión',
                  QUALIFIED: 'Calificado',
                  QUOTE: 'Presupuestado',
                  WON: 'Ganado',
                };
                return (
                  <div key={status} className="flex-shrink-0 text-center">
                    <div className={`w-12 h-12 rounded-lg ${colors[status]} flex items-center justify-center text-white font-bold text-lg`}>
                      {count}
                    </div>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{labels[status]}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100 flex items-center justify-between">
             Últimos contactos
              <Link href="/contacts" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Ver todos →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contacts.slice(0, 4).map((contact: any) => (
                <div key={contact.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                      {contact.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.status}</p>
                    </div>
                  </div>
                  {contact.value && (
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      ${contact.value.toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {pendingTasksList.length > 0 && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Follow Ups Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingTasksList.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</span>
                  </div>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">Actividad de la Semana</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] dark:text-gray-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activities}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:opacity-20" stroke="#6b7280" />
                <XAxis dataKey="date" fontSize={12} stroke="#9ca3af" />
                <YAxis fontSize={12} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                  itemStyle={{ color: '#f9fafb' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="contacts" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Contactos" />
                <Bar dataKey="interactions" fill="#10b981" radius={[4, 4, 0, 0]} name="Interacciones" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] dark:text-gray-100">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#9ca3af' }}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                  itemStyle={{ color: '#f9fafb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {statusDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Building2 className="h-4 w-4" />
              Proyectos Ganados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCompanies.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No hay proyectos ganados
              </p>
            ) : (
              <div className="space-y-3">
                {topCompanies.map((company, index) => (
                  <div key={company.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm font-medium text-green-700 dark:text-green-300">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{company.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ${(company.value || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300">
                      ${(company.value || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <TrendingUp className="h-4 w-4" />
              Métricas de Conversión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tasa de Contactación</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{contactedRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${contactedRate}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tasa de Conversión</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{conversionRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${conversionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tasa de Pérdida</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{stats.total > 0 ? ((stats.lost / stats.total) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.lost / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
