export type ChartType = 
  | 'bar'
  | 'line'
  | 'pie'
  | 'scatter'
  | 'area'
  | 'heatmap'
  | 'bubble'
  | 'radar'
  | 'doughnut'
  | 'polarArea';

export interface DataPoint {
  id?: string;
  [key: string]: any;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

export interface ChartConfig {
  type: ChartType;
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend: boolean;
  showGrid: boolean;
  responsive: boolean;
  maintainAspectRatio: boolean;
  animation: boolean;
  colors: string[];
  fontSize: number;
  padding: number;
}

export interface ChartState {
  data: ChartData;
  config: ChartConfig;
  isLoading: boolean;
  error: string | null;
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf' | 'svg';
  quality: number;
  width: number;
  height: number;
  backgroundColor: string;
}

export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  gridColor: string;
}

export interface UserPreferences {
  theme: Theme;
  defaultChartType: ChartType;
  autoSave: boolean;
  showTutorial: boolean;
  language: string;
}

export interface DrillDownData {
  parentId: string;
  childData: ChartData;
  level: number;
  path: string[];
}

export interface RealTimeConfig {
  enabled: boolean;
  interval: number;
  maxDataPoints: number;
  source: 'api' | 'websocket' | 'manual';
  endpoint?: string;
} 