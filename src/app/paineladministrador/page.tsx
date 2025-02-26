"use client";
import React from 'react';
import { Box, Grid } from '@mui/material';
import StatCard from './components/dashboard/StatCard';
import SalesChart from './components/dashboard/SalesChart';
import MetricsList from './components/dashboard/MetricsList';

const metricsData = [
  { label: 'Taxa de Conversão', value: '2.4%' },
  { label: 'Ticket Médio', value: 'R$ 358,00' },
  { label: 'Taxa de Rejeição', value: '32%' },
  { label: 'Tempo Médio', value: '3m 45s' }
];

export default function Dashboard() {
  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <StatCard
            title="Taxa de Crescimento"
            value="6.8%"
            subtitle="Comparado ao mês anterior"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Conversão Mensal"
            value="13%"
            subtitle="Meta: 15%"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total de Vendas"
            value="4630"
            subtitle="Últimos 30 dias"
            delay={0.3}
          />
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <SalesChart />
        </Grid>

        {/* Metrics */}
        <Grid item xs={12} md={4}>
          <MetricsList
            title="Métricas Importantes"
            items={metricsData}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
