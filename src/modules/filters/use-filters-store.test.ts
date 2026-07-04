import { useFilterStore } from './use-filters-store';

beforeEach(() => {
  useFilterStore.setState({
    dateRange: { startDate: null, endDate: null, startTime: null, endTime: null },
    accounts: [],
    industries: [],
    states: [],
  });
});

describe('Use Filter Store', () => {
  it('Initializes with empty filter state', () => {
    const state = useFilterStore.getState();
    expect(state.accounts).toEqual([]);
    expect(state.industries).toEqual([]);
    expect(state.states).toEqual([]);
    expect(state.dateRange.startDate).toBeNull();
  });

  it('Sets date range', () => {
    useFilterStore.getState().setDateRange({
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      startTime: null,
      endTime: null,
    });
    const state = useFilterStore.getState();
    expect(state.dateRange.startDate).toBe('2024-01-01');
    expect(state.dateRange.endDate).toBe('2024-12-31');
  });

  it('Toggles account on', () => {
    useFilterStore.getState().toggleAccount('Acme Corp');
    expect(useFilterStore.getState().accounts).toEqual(['Acme Corp']);
  });

  it('Toggles account off', () => {
    useFilterStore.getState().toggleAccount('Acme Corp');
    useFilterStore.getState().toggleAccount('Acme Corp');
    expect(useFilterStore.getState().accounts).toEqual([]);
  });

  it('Toggles industry on', () => {
    useFilterStore.getState().toggleIndustry('Retail');
    expect(useFilterStore.getState().industries).toEqual(['Retail']);
  });

  it('Toggles industry off', () => {
    useFilterStore.getState().toggleIndustry('Retail');
    useFilterStore.getState().toggleIndustry('Retail');
    expect(useFilterStore.getState().industries).toEqual([]);
  });

  it('Toggles state on', () => {
    useFilterStore.getState().toggleState('SP');
    expect(useFilterStore.getState().states).toEqual(['SP']);
  });

  it('Toggles state off', () => {
    useFilterStore.getState().toggleState('SP');
    useFilterStore.getState().toggleState('SP');
    expect(useFilterStore.getState().states).toEqual([]);
  });

  it('Sets accounts directly', () => {
    useFilterStore.getState().setAccounts(['Acme', 'Beta']);
    expect(useFilterStore.getState().accounts).toEqual(['Acme', 'Beta']);
  });

  it('Sets industries directly', () => {
    useFilterStore.getState().setIndustries(['Retail', 'Tech']);
    expect(useFilterStore.getState().industries).toEqual(['Retail', 'Tech']);
  });

  it('Sets states directly', () => {
    useFilterStore.getState().setStates(['SP', 'RJ']);
    expect(useFilterStore.getState().states).toEqual(['SP', 'RJ']);
  });

  it('Resets all filters', () => {
    useFilterStore.getState().toggleAccount('Acme');
    useFilterStore.getState().toggleIndustry('Retail');
    useFilterStore.getState().toggleState('SP');
    useFilterStore.getState().resetFilters();
    const state = useFilterStore.getState();
    expect(state.accounts).toEqual([]);
    expect(state.industries).toEqual([]);
    expect(state.states).toEqual([]);
  });

  it('Maintains multiple toggled values', () => {
    useFilterStore.getState().toggleAccount('Acme');
    useFilterStore.getState().toggleAccount('Beta');
    expect(useFilterStore.getState().accounts).toEqual(['Acme', 'Beta']);
  });
});
