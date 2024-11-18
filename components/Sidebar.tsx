"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useFinancialContext } from '@/context/FinancialContext';
import { FinancialData } from '@/types/FinancialData';
import { formatYear } from '@/lib/dateUtils';
import { useTheme } from 'next-themes';

interface SidebarProps {
  onSelectRecord: (record: FinancialData) => void;
  onNewRecord: () => void;
  isExpanded: boolean;
}

export function Sidebar({ onSelectRecord, onNewRecord, isExpanded }: SidebarProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { financialData } = useFinancialContext();
  const { theme } = useTheme();

  return (
    <div
      className={`bg-secondary h-full flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      {isExpanded && (
        <>
          <div className="p-4">
            <Button onClick={onNewRecord} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Registro
            </Button>
          </div>
          <ScrollArea className="flex-grow">
            {financialData.map((record) => (
              <div
                key={record.id}
                className={`p-4 cursor-pointer transition-colors duration-200 ${
                  selectedId === record.id ? 'bg-accent' : ''
                } ${
                  theme === 'dark'
                    ? 'hover:bg-white hover:text-black'
                    : 'hover:bg-black hover:text-white'
                }`}
                onClick={() => {
                  setSelectedId(record.id);
                  onSelectRecord(record);
                }}
              >
                <div className="font-bold">{record.activo}</div>
                <div className="text-sm">
                  {formatYear(record.inicio)} - {formatYear(record.fin)}
                </div>
              </div>
            ))}
          </ScrollArea>
        </>
      )}
    </div>
  );
}
