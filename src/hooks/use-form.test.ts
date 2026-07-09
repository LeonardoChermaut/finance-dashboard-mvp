import { act, renderHook } from '@testing-library/react';
import { z } from 'zod';
import { useForm } from './use-form';

const testSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
});

const mockOnSubmit = jest.fn();

const mockPerson = {
  name: 'Joao',
  email: 'joao@test.com',
};

beforeEach(() => jest.clearAllMocks());

describe('useForm', () => {
  it('Initializes with empty values and no errors', () => {
    const { result } = renderHook(() => useForm(testSchema));
    expect(result.current.values).toEqual({});
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('Updates field value on handleChange', () => {
    const { result } = renderHook(() => useForm(testSchema));
    act(() => result.current.handleChange('name', mockPerson.name));
    expect(result.current.values.name).toBe(mockPerson.name);
  });

  it('Validates successfully with valid data', () => {
    const { result } = renderHook(() => useForm(testSchema));
    act(() => {
      result.current.handleChange('name', mockPerson.name);
      result.current.handleChange('email', mockPerson.email);
    });

    let isValid = false;

    act(() => (isValid = result.current.validate(result.current.values)));

    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('Sets errors on validation failure', () => {
    const { result } = renderHook(() => useForm(testSchema));

    let isValid = true;

    act(() => (isValid = result.current.validate(result.current.values)));

    expect(isValid).toBe(false);
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('Does not call onSubmit when validation fails', async () => {
    const { result } = renderHook(() => useForm(testSchema));
    const onSubmit = jest.fn();
    await act(async () => {
      await result.current.handleSubmit(onSubmit);
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with values when validation passes', async () => {
    const { result } = renderHook(() => useForm(testSchema));
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    act(() => {
      result.current.handleChange('name', mockPerson.name);
      result.current.handleChange('email', mockPerson.email);
    });
    await act(async () => {
      await result.current.handleSubmit(onSubmit);
    });
    expect(onSubmit).toHaveBeenCalledWith(mockPerson);
  });

  it('Sets isSubmitting to true during submit', async () => {
    const { result } = renderHook(() => useForm(testSchema));
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
    const onSubmit = jest.fn(() => submitPromise);
    act(() => {
      result.current.handleChange('name', mockPerson.name);
      result.current.handleChange('email', mockPerson.email);
    });
    act(() => {
      result.current.handleSubmit(onSubmit);
    });
    expect(result.current.isSubmitting).toBe(true);
    await act(async () => {
      resolveSubmit!();
      await submitPromise;
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  it('Clears errors after successful validation', () => {
    const { result } = renderHook(() => useForm(testSchema));
    act(() => {
      result.current.validate(result.current.values);
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    act(() => {
      result.current.handleChange('name', mockPerson.name);
      result.current.handleChange('email', mockPerson.email);
    });
    act(() => {
      result.current.validate(result.current.values);
    });
    expect(result.current.errors).toEqual({});
  });

  it('Allows setting values directly via setValues', () => {
    const { result } = renderHook(() => useForm(testSchema));
    act(() => {
      result.current.setValues(mockPerson);
    });
    expect(result.current.values).toEqual(mockPerson);
  });

  it('Allows setting errors directly via setErrors', () => {
    const { result } = renderHook(() => useForm(testSchema));
    act(() => {
      result.current.setErrors({ name: 'Custom error' });
    });
    expect(result.current.errors.name).toBe('Custom error');
  });
});
