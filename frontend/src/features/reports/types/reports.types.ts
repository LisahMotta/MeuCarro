export interface MonthExpense {
  month: number;
  fuelTotal: number;
  fuelLiters: number;
  fuelCount: number;
  maintTotal: number;
  maintCount: number;
  total: number;
}

export interface CategoryExpense {
  category: string;
  total: number;
  count: number;
}

export interface ExpenseReport {
  year: number;
  months: MonthExpense[];
  fuel: {
    total: number;
    liters: number;
    count: number;
    avgConsumption: number;
    avgPrice: number;
  };
  maintenance: {
    total: number;
    laborCost: number;
    partsCost: number;
    count: number;
    byCategory: CategoryExpense[];
  };
  grandTotal: number;
}

export type HistoryEventType = 'fueling' | 'maintenance' | 'tire_event' | 'document';

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  date: string;
  title: string;
  subtitle?: string;
  amount: number;
  odometer?: number;
  meta: Record<string, unknown>;
}
