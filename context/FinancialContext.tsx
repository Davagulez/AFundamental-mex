"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FinancialData } from '@/types/FinancialData';

interface User {
  username: string;
}

interface FinancialContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  financialData: FinancialData[];
  addFinancialData: (newData: FinancialData) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('financialData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Si es necesario, valida los datos aquí
        setFinancialData(parsedData as FinancialData[]);
      } catch (error) {
        console.error('Error parsing financial data from localStorage:', error);
      }
    }
  }, []);

const addFinancialData = (newData: FinancialData) => {
  const updatedData = [newData, ...financialData];
  setFinancialData(updatedData);
  localStorage.setItem('financialData', JSON.stringify(updatedData));
};

  return (
    <FinancialContext.Provider value={{ user, setUser, financialData, addFinancialData }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancialContext = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancialContext must be used within a FinancialProvider');
  }
  return context;
};