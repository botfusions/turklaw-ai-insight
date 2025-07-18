
import { ReactNode, HTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ErrorDisplayProps extends BaseComponentProps {
  error: string | Error | null;
  onRetry?: () => void;
  showRetry?: boolean;
  variant?: 'default' | 'destructive' | 'warning';
}

export interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface TableProps<T> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}
