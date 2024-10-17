"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NewRecordForm } from '@/components/NewRecordForm';
import { useFinancialContext } from '@/context/FinancialContext';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { FinancialData } from '@/types/FinancialData';
import { formatYear, formatDate } from '@/lib/dateUtils';
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  const { financialData, addFinancialData } = useFinancialContext();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const searchParams = useSearchParams();
  const showFormParam = searchParams.get('showForm');

  useEffect(() => {
    if (financialData.length > 0) {
      setData(financialData[0]);
    }
    // Si el parámetro 'showForm' es 'true', mostramos el formulario
    if (showFormParam === 'true') {
      setShowNewRecordForm(true);
    }
  }, [financialData, showFormParam]);

  // Determinar el título de la página basado en el estado actual
  let pageTitle = '';

  if (showNewRecordForm) {
    pageTitle = 'Generar Análisis';
  } else if (!data) {
    pageTitle = 'No hay datos disponibles';
  }

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
        <main className="flex-1 overflow-auto p-4 flex justify-center">
          <div className='w-3/5'>
            {pageTitle && <h1 className="text-3xl font-bold mb-4">{pageTitle}</h1>}
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data.activo}</TableCell>
                          <TableCell>{formatYear(data.inicio)}</TableCell>
                          <TableCell>{formatYear(data.fin)}</TableCell>
                          <TableCell>{formatDate(data.createdAt)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {data && Object.entries(data.resultado).map(([section, sectionData]) => (
                  <Card key={section} className="mb-8">
                    <CardHeader>
                      <CardTitle className="capitalize">{section.replace('_', ' ')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                          <TableHead className="w-3/5">Métrica</TableHead>
                          <TableHead className="w-2/5">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(sectionData as Record<string, string>).map(([metric, value]) => (
                            <TableRow key={metric}>
                              <TableCell className="w-3/5 font-medium capitalize">{metric.replace(/_/g, ' ')}</TableCell>
                              <TableCell className="w-2/5">{value}</TableCell>
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
          </div>
        </main>
      </div>
    </div>
  );
}