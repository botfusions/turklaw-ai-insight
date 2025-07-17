import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  pageSize,
  onPageSizeChange
}) => {
  return (
    <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5 sonuç</SelectItem>
        <SelectItem value="10">10 sonuç</SelectItem>
        <SelectItem value="20">20 sonuç</SelectItem>
      </SelectContent>
    </Select>
  );
};