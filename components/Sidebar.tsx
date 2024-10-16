"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useFinancialContext } from '@/context/FinancialContext';

interface Record {
  id: number;
  activo: string;
  inicio: string;
  fin: string;
}

interface SidebarProps {
  onSelectRecord: (record: Record) => void;
  onNewRecord: () => void;
  isExpanded: boolean;
}

export function Sidebar({ onSelectRecord, onNewRecord, isExpanded }: SidebarProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { financialData } = useFinancialContext();

  return (
    <div className={`bg-secondary h-full flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      <div className="p-4">
        <Button onClick={onNewRecord} className={`w-full ${isExpanded ? '' : 'px-2'}`}>
          <Plus className="h-4 w-4" />
          {isExpanded && <span className="ml-2">Nuevo Registro</span>}
        </Button>
      </div>
      {isExpanded && (
        <ScrollArea className="flex-grow">
          {financialData.map((record) => (
            <div
              key={record.id}
              className={`p-4 cursor-pointer hover:bg-accent ${selectedId === record.id ? 'bg-accent' : ''}`}
              onClick={() => {
                setSelectedId(record.id);
                onSelectRecord(record);
              }}
            >
              <div className="font-bold">{record.activo}</div>
              <div className="text-sm">{record.inicio} - {record.fin}</div>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}