import { Paper, Typography, List, ListItem } from '@mui/material';

interface MetricsListProps {
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
}

export default function MetricsList({ title, items }: MetricsListProps) {
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
        {title}
      </Typography>
      <List className="space-y-2">
        {items.map((item, index) => (
          <ListItem 
            key={index}
            className="flex justify-between items-center px-2 py-1"
          >
            <Typography variant="body2" className="text-gray-600">
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#0C114E', fontWeight: 500 }}>
              {item.value}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
} 