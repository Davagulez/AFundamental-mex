"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NewRecordForm } from '@/components/NewRecordForm';
import { useFinancialContext } from '@/context/FinancialContext';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';

interface FinancialData {
  id: number;
  documentId: string;
  activo: string;
  inicio: string;
  fin: string;
  resultado: {
    income_status: {
      [key: string]: string;
    };
    margins: {
      [key: string]: string;
    };
    balance_sheet: {
      [key: string]: string;
    };
    financial_ratios: {
      [key: string]: string;
    };
    stock_information: {
      [key: string]: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export default function Dashboard() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  const { financialData, addFinancialData } = useFinancialContext();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    if (financialData.length > 0) {
      setData(financialData[0]);
    }
  }, [financialData]);

  const handleSelectRecord = (record: FinancialData) => {
    setData(record);
    setShowNewRecordForm(false);
  };

  const handleNewRecord = (newRecordData: FinancialData) => {
    addFinancialData(newRecordData);
    setData(newRecordData);
    setShowNewRecordForm(false);
  };

  const handleShowNewRecordForm = () => {
    setShowNewRecordForm(true);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        onSelectRecord={handleSelectRecord} 
        onNewRecord={handleShowNewRecordForm}
        isExpanded={isSidebarExpanded}
      />
      <div className="flex flex-col flex-1">
        <TopBar 
          isSidebarExpanded={isSidebarExpanded} 
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Dashboard Financiero</h1>
          {showNewRecordForm ? (
            <NewRecordForm onSubmit={handleNewRecord} />
          ) : data ? (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activo</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead>Actualizado</TableHead>
                        <TableHead>Publicado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{data.activo}</TableCell>
                        <TableCell>{formatDate(data.inicio)}</TableCell>
                        <TableCell>{formatDate(data.fin)}</TableCell>
                        <TableCell>{formatDate(data.createdAt)}</TableCell>
                        <TableCell>{formatDate(data.updatedAt)}</TableCell>
                        <TableCell>{formatDate(data.publishedAt)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {Object.entries(data.resultado).map(([section, sectionData]) => (
                <Card key={section} className="mb-8">
                  <CardHeader>
                    <CardTitle className="capitalize">{section.replace('_', ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Métrica</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(sectionData).map(([metric, value]) => (
                          <TableRow key={metric}>
                            <TableCell className="font-medium capitalize">{metric.replace(/_/g, ' ')}</TableCell>
                            <TableCell>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <div>No hay datos disponibles</div>
          )}
        </main>
      </div>
    </div>
  );
}