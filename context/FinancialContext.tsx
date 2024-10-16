"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
}

interface FinancialData {
  id: number;
  documentId: string;
  activo: string;
  inicio: string;
  fin: string;
  resultado: {
    income_status: {
      [key: string]: number;
    };
    margins: {
      [key: string]: number;
    };
    balance_sheet: {
      [key: string]: number;
    };
    financial_ratios: {
      [key: string]: number;
    };
    stock_information: {
      [key: string]: number;
    };
  };
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
      setFinancialData(JSON.parse(storedData));
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