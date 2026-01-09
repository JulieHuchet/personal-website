import React, { createContext, useContext, useMemo, useState } from 'react';

interface PlanningContextValue {
  quarter: string;
  area: string;
  product: string;
  setQuarter: (quarter: string) => void;
  setArea: (area: string) => void;
  setProduct: (product: string) => void;
}

const PlanningContext = createContext<PlanningContextValue | undefined>(undefined);

export const PlanningContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quarter, setQuarter] = useState<string>('Q1 2026');
  const [area, setArea] = useState<string>('');
  const [product, setProduct] = useState<string>('');

  const value = useMemo<PlanningContextValue>(
    () => ({
      quarter,
      area,
      product,
      setQuarter,
      setArea,
      setProduct,
    }),
    [quarter, area, product]
  );

  return <PlanningContext.Provider value={value}>{children}</PlanningContext.Provider>;
};

export const usePlanningContext = (): PlanningContextValue => {
  const ctx = useContext(PlanningContext);
  if (!ctx) {
    throw new Error('usePlanningContext must be used within PlanningContextProvider');
  }
  return ctx;
};
