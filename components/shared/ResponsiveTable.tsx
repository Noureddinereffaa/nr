import { useState, ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => ReactNode;
    mobileLabel?: string; // Optional shorter label for mobile
}

interface ResponsiveTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    className?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
    data,
    columns,
    onRowClick,
    emptyMessage = 'لا توجد بيانات',
    className = ''
}: ResponsiveTableProps<T>) {
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: keyof T) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedData = sortKey
        ? [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            const modifier = sortDirection === 'asc' ? 1 : -1;

            // Handle different types
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal) * modifier;
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return (aVal - bVal) * modifier;
            }
            return aVal > bVal ? modifier : -modifier;
        })
        : data;

    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={className}>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-800 dark:border-slate-700 light:border-slate-200">
                <table className="w-full">
                    <thead className="bg-slate-800 dark:bg-slate-800 light:bg-slate-100 border-b border-slate-700 dark:border-slate-700 light:border-slate-200">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    className={`px-4 py-3 text-right text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 ${col.sortable ? 'cursor-pointer hover:text-white dark:hover:text-white light:hover:text-slate-900 select-none' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2 justify-end">
                                        {col.label}
                                        {col.sortable && sortKey === col.key && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp size={16} className="text-indigo-400" />
                                                : <ChevronDown size={16} className="text-indigo-400" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 dark:divide-slate-800 light:divide-slate-200">
                        {sortedData.map((row, idx) => (
                            <tr
                                key={idx}
                                onClick={() => onRowClick?.(row)}
                                className={`transition-colors ${onRowClick
                                        ? 'cursor-pointer hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-slate-50'
                                        : ''
                                    }`}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className="px-4 py-3 text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 text-right"
                                    >
                                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {sortedData.map((row, idx) => (
                    <div
                        key={idx}
                        onClick={() => onRowClick?.(row)}
                        className={`bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg p-4 border border-slate-700 dark:border-slate-700 light:border-slate-200 ${onRowClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''
                            }`}
                    >
                        {columns.map((col) => (
                            <div
                                key={String(col.key)}
                                className="flex justify-between items-center py-2 border-b border-slate-700 dark:border-slate-700 light:border-slate-200 last:border-0"
                            >
                                <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
                                    {col.mobileLabel || col.label}
                                </span>
                                <span className="text-sm text-slate-200 dark:text-slate-200 light:text-slate-900 font-medium">
                                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
