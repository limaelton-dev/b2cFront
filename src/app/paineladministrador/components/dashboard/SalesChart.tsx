import { Paper, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', value: 65 },
  { name: 'Fev', value: 45 },
  { name: 'Mar', value: 75 },
  { name: 'Abr', value: 55 },
  { name: 'Mai', value: 70 },
  { name: 'Jun', value: 50 },
  { name: 'Jul', value: 60 },
];

export default function SalesChart() {
  return (
    <Paper 
      elevation={0}
      className="p-4 border border-gray-100"
      sx={{ 
        borderRadius: '8px',
        background: 'white',
        height: '100%'
      }}
    >
      <Typography variant="body2" className="text-gray-500 mb-4">
        Desempenho de Vendas
      </Typography>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#718096"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#718096"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#691111"
              strokeWidth={2}
              dot={{ fill: '#691111', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#691111' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
} 