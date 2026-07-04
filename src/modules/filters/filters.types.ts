export type DateRange = Readonly<{
  endDate: string | null;
  startDate: string | null;
  startTime: string | null;
  endTime: string | null;
}>;

export type FilterState = Readonly<{
  dateRange: DateRange;
  states: readonly string[];
  accounts: readonly string[];
  industries: readonly string[];
}>;

export type FilterOptions = Readonly<{
  minDate: string | null;
  maxDate: string | null;
  states: readonly string[];
  accounts: readonly string[];
  industries: readonly string[];
}>;
