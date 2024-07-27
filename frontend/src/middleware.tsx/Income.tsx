import React, { createContext, useState, useContext, ReactNode } from 'react';

interface IncomeData {
  techJob: number;
  otherIncome: number;
}

interface IncomeContextProps {
  incomeData: IncomeData;
  setIncomeData: React.Dispatch<React.SetStateAction<IncomeData>>;
}

const IncomeContext = createContext<IncomeContextProps | undefined>(undefined);

export const useIncome = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error('useIncome must be used within an IncomeProvider');
  }
  return context;
};

export const IncomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incomeData, setIncomeData] = useState<IncomeData>({ techJob: 0, otherIncome: 0 });

  return (
    <IncomeContext.Provider value={{ incomeData, setIncomeData }}>
      {children}
    </IncomeContext.Provider>
  );
};
