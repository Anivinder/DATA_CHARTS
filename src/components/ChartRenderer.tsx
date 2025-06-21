import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  PolarArea,
  Radar,
  Scatter,
  Bubble,
} from 'react-chartjs-2';
import { ChartData, ChartConfig, ChartType } from '../types';
import { useTheme } from '../contexts/ThemeContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartRendererProps {
  data: ChartData;
  config: ChartConfig;
  chartType: ChartType;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ data, config, chartType }) => {
  const { theme } = useTheme();
  
  const chartOptions = {
    responsive: config.responsive,
    maintainAspectRatio: config.maintainAspectRatio,
    animation: config.animation ? {} : false,
    plugins: {
      title: {
        display: true,
        text: config.title,
        font: {
          size: config.fontSize + 2,
          weight: 'bold' as const,
        },
        color: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
      },
      legend: {
        display: config.showLegend,
        position: 'top' as const,
        labels: {
          font: {
            size: config.fontSize,
          },
          color: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
        },
      },
      tooltip: {
        backgroundColor: theme.mode === 'dark' ? '#374151' : '#ffffff',
        titleColor: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
        bodyColor: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
        borderColor: theme.mode === 'dark' ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: !!config.xAxisLabel,
          text: config.xAxisLabel,
          font: {
            size: config.fontSize,
          },
          color: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
        },
        grid: {
          display: config.showGrid,
          color: theme.mode === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
          font: {
            size: config.fontSize - 2,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        display: true,
        title: {
          display: !!config.yAxisLabel,
          text: config.yAxisLabel,
          font: {
            size: config.fontSize,
          },
          color: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
        },
        grid: {
          display: config.showGrid,
          color: theme.mode === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
          font: {
            size: config.fontSize - 2,
          },
        },
      },
    },
    layout: {
      padding: config.padding,
    },
  };

  const renderChart = () => {
    const commonProps = {
      data,
      options: chartOptions,
    };

    switch (chartType) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'line':
        return <Line {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      case 'polarArea':
        return <PolarArea {...commonProps} />;
      case 'radar':
        return <Radar {...commonProps} />;
      case 'scatter':
        return <Scatter {...commonProps} />;
      case 'bubble':
        return <Bubble {...commonProps} />;
      case 'area':
        // Area chart is a line chart with fill
        const areaData = {
          ...data,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            fill: true,
            tension: 0.4,
          })),
        };
        return <Line data={areaData} options={chartOptions} />;
      case 'heatmap':
        // Heatmap is implemented as a special bar chart
        return <Bar {...commonProps} />;
      default:
        return <Bar {...commonProps} />;
    }
  };

  return (
    <div className="absolute inset-0">
      {renderChart()}
    </div>
  );
};

export default ChartRenderer; 