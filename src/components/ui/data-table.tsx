'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrmButton, IconButton } from './crm-button';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';
import { 
  ChevronUp, ChevronDown, ChevronsUpDown, 
  ChevronLeft, ChevronRight, Search, X
} from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading = false,
  loadingRows = 5,
  emptyMessage = 'No hay datos',
  searchable = false,
  searchPlaceholder = 'Buscar...',
  onSearch,
  pagination,
  selectable = false,
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allKeys = new Set(data.map(keyExtractor));
      setSelectedRows(allKeys);
      onSelectionChange?.(data);
    }
  };

  const handleSelectRow = (key: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(data.filter(item => newSelected.has(keyExtractor(item))));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = String((a as Record<string, unknown>)[sortKey] ?? '');
    const bVal = String((b as Record<string, unknown>)[sortKey] ?? '');
    if (aVal === bVal) return 0;
    if (sortDirection === 'asc') {
      return aVal.localeCompare(bVal);
    }
    return bVal.localeCompare(aVal);
  });

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <div className={cn('space-y-4', className)}>
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === data.length && data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
                      column.sortable && 'cursor-pointer hover:bg-gray-100'
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.sortable && (
                        sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 opacity-40" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {isLoading ? (
                  Array.from({ length: loadingRows }).map((_, i) => (
                    <tr key={i}>
                      {selectable && (
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-4" />
                        </td>
                      )}
                      {columns.map((col, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full max-w-[200px]" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item) => {
                    const key = keyExtractor(item);
                    const isSelected = selectedRows.has(key);
                    return (
                      <motion.tr
                        key={key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          'hover:bg-gray-50 transition-colors',
                          onRowClick && 'cursor-pointer',
                          isSelected && 'bg-primary-50'
                        )}
                        onClick={() => onRowClick?.(item)}
                      >
                        {selectable && (
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(key)}
                              className="rounded border-gray-300"
                            />
                          </td>
                        )}
                        {columns.map((column) => (
                          <td key={column.key} className="px-4 py-3 text-sm text-gray-700">
                            {column.render
                              ? column.render(item)
                              : String((item as Record<string, unknown>)[column.key] ?? '')}
                          </td>
                        ))}
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {(pagination.page - 1) * pagination.pageSize + 1} a{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
            {pagination.total} resultados
          </p>
          <div className="flex items-center gap-2">
            <IconButton
              size="iconSm"
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </IconButton>
            <span className="text-sm text-gray-600">
              Página {pagination.page} de {totalPages}
            </span>
            <IconButton
              size="iconSm"
              variant="outline"
              disabled={pagination.page === totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}
