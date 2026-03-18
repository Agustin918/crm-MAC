'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FunnelData {
  name: string;
  value: number;
  color: string;
}

export default function FunnelPage() {
  const [data, setData] = useState<FunnelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFunnelData();
  }, []);

  const fetchFunnelData = async () => {
    try {
      const res = await fetch('/api/contacts');
      const contacts = await res.json();
      
      const statusCounts = {
        LEAD: 0,
        CONTACTED: 0,
        QUALIFIED: 0,
        WON: 0,
        LOST: 0
      };

      contacts.forEach((c: any) => {
        if (statusCounts.hasOwnProperty(c.status)) {
          statusCounts[c.status as keyof typeof statusCounts]++;
        }
      });

      const funnelData: FunnelData[] = [
        { name: 'Lead', value: statusCounts.LEAD, color: '#3b82f6' },
        { name: 'Contactado', value: statusCounts.CONTACTED, color: '#eab308' },
        { name: 'Calificado', value: statusCounts.QUALIFIED, color: '#f97316' },
        { name: 'Ganado', value: statusCounts.WON, color: '#22c55e' },
        { name: 'Perdido', value: statusCounts.LOST, color: '#ef4444' },
      ];

      setData(funnelData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const total = data.reduce((acc, item) => acc + item.value, 0);
  const wonRate = total > 0 ? ((data.find(d => d.name === 'Ganado')?.value || 0) / total * 100).toFixed(1) : 0;
  const lostRate = total > 0 ? ((data.find(d => d.name === 'Perdido')?.value || 0) / total * 100).toFixed(1) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Funnel</h2>
        <p className="text-gray-500 dark:text-gray-400">Análisis de conversión de leads.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{total}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Tasa de Éxito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{wonRate}%</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Tasa de Pérdida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{lostRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Distribución por Etapa</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] dark:text-gray-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" stroke="#6b7280" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" width={80} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                  itemStyle={{ color: '#f9fafb' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Conversión</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] dark:text-gray-100">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#9ca3af' }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabla de Conversión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total * 100).toFixed(1) : 0;
              const previousValue = index > 0 ? data[index - 1].value : item.value;
              const conversionRate = previousValue > 0 ? (item.value / previousValue * 100).toFixed(1) : 100;
              
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">{item.value} contactos</span>
                      <span className="text-sm font-medium">{percentage}%</span>
                      {index > 0 && (
                        <span className="text-xs text-slate-400">
                          {conversionRate}% conv.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
