import React from 'react';

export interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label }) => {
  return (
    <div>
      {label && <label className="block text-sm text-gray-400 mb-2">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

