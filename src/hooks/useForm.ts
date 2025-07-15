import { useState, useCallback } from 'react';

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormActions<T> {
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e?: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  validateField: (name: keyof T) => void;
  validateForm: () => boolean;
}

export interface FormConfig<T> {
  initialValues: T;
  validationSchema?: Partial<Record<keyof T, (value: any) => string | undefined>>;
  onSubmit?: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema = {},
  onSubmit
}: FormConfig<T>): FormState<T> & FormActions<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: keyof T) => {
    const validator = validationSchema[name];
    if (validator) {
      const error = validator(values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
      return !error;
    }
    return true;
  }, [values, validationSchema]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(key => {
      const name = key as keyof T;
      const validator = validationSchema[name];
      if (validator) {
        const error = validator(values[name]);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema]);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  }, [validateField]);

  const handleSubmit = useCallback((submitFn: (values: T) => Promise<void> | void) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);
      
      try {
        const isValid = validateForm();
        if (!isValid) {
          // Mark all fields as touched to show errors
          const allTouched = Object.keys(initialValues).reduce((acc, key) => {
            acc[key as keyof T] = true;
            return acc;
          }, {} as Partial<Record<keyof T, boolean>>);
          setTouched(allTouched);
          return;
        }

        await (submitFn || onSubmit)?.(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateForm, initialValues, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const isValid = Object.keys(errors).length === 0 && Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError,
    setFieldValue,
    validateField,
    validateForm
  };
}