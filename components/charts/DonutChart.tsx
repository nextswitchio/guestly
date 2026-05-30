'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  dataKey: string;
  nameKey: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  cx?: string | number;
  cy?: string | number;
  label?: boolean;
  legend?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C', '#D0ED57', '#FF6B6B'];

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  dataKey = 'value',
  nameKey = 'name',
  colors = COLORS,
  innerRadius = 60,
  outerRadius = 100,
  cx = '50%',
  cy = '50%',
  label = false,
  legend = true,
}) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-neutral-500 py-8">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={label}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        {legend && <Legend />}
        <Tooltip
          formatter={((value: number | string, name: string) => [`${typeof value === 'number' ? value.toLocaleString() : value ?? ''}`, name]) as any}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
