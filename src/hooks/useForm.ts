import { ChangeEvent, useState } from 'react';

type GenericObject = Record<string, any>;

type Handler<T> = (name: keyof T, value: any) => void;

type UseFormReturn<T> = {
  values: T;
  setValue: (name: keyof T, value: any) => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  reset: (newState?: T) => void;
  bind: (name: keyof T) => {
    name: keyof T;
    value: T[keyof T];
    onChange: (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
  };
};

export function useForm<T extends GenericObject>(
  initialState: T
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialState);

  const setValue: Handler<T> = (name, value) => {
    setValues((prev: T) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const CHECKBOX_TYPE = 'checkbox';
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const isCheckbox = type === CHECKBOX_TYPE;
    setValue(name as keyof T, isCheckbox ? checked : value);
  };

  const reset = (newState: T = initialState) => setValues(newState);

  const bind = (name: keyof T) => ({
    name,
    value: values[name],
    onChange: handleChange,
  });

  return {
    values,
    setValue,
    handleChange,
    reset,
    bind,
  };
}
