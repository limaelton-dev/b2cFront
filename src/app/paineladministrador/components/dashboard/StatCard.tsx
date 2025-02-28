import { Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  delay?: number;
}

export default function StatCard({ title, value, subtitle, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper 
        elevation={0}
        className="p-4 h-full border border-gray-100"
        sx={{ 
          borderRadius: '8px',
          background: 'white',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body2" className="text-gray-500 mb-2">
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          className="mb-1"
          sx={{ 
            color: '#691111',
            fontWeight: 500
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" className="text-gray-400">
            {subtitle}
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
} 