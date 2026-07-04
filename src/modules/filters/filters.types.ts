export type DateRange = {
  endDate: string | null;
  startDate: string | null;
  startTime: string | null;
  endTime: string | null;
};

export type FilterState = {
  dateRange: DateRange;
  states: string[];
  accounts: string[];
  industries: string[];
};

export type FilterOptions = {
  minDate: string | null;
  maxDate: string | null;
  states: string[];
  accounts: string[];
  industries: string[];
};
