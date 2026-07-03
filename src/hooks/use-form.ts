'use client';

import { useState } from 'react';
import { z } from 'zod';

type FormErrors<T> = Partial<Record<keyof T, string>>;

export const useForm = <T extends z.ZodType>(schema: T) => {
  const [values, setValues] = useState<z.infer<T>>({} as z.infer<T>);
  const [errors, setErrors] = useState<FormErrors<z.infer<T>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data: z.infer<T>): boolean => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: FormErrors<z.infer<T>> = {};
      const issues = result.error.issues;
      for (const issue of issues) {
        const fieldName = issue.path[0] as keyof z.infer<T> | undefined;
        if (fieldName) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (field: keyof z.infer<T>, value: string): void => {
    setValues((prev) => {
      const updated = { ...(prev as Record<string, unknown>), [field]: value };
      return updated as z.infer<T>;
    });
  };

  const handleSubmit = async (onSubmit: (data: z.infer<T>) => Promise<void>): Promise<void> => {
    if (!validate(values)) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
    validate,
  };
};
