import React from 'react';

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ data, title, height = 300 }) => {
  // Placeholder - will be replaced with Recharts in frontend
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div style={{ height }} className="flex items-end justify-between gap-2">
        {data.map((point, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-blue-600 rounded-t"
              style={{ height: `${(point.value / Math.max(...data.map((d) => d.value))) * 100}%` }}
            />
            <span className="text-xs text-gray-400 mt-2">{point.label || point.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

