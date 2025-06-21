import React from 'react';
import { ChartType, ChartConfig, ChartData } from '../types';
import { Palette, Type, Grid, Database, Settings } from 'lucide-react';

interface ChartControlsProps {
  config: ChartConfig;
  onConfigChange: (config: Partial<ChartConfig>) => void;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  allDatasets: ChartData['datasets'];
  activeDatasets: string[];
  onDatasetToggle: (label: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  config,
  onConfigChange,
  chartType,
  onChartTypeChange,
  allDatasets,
  activeDatasets,
  onDatasetToggle,
}) => {
  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Chart Controls
      </h3>

      {/* Chart Type Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Chart Type
          </span>
        </div>
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="scatter">Scatter Plot</option>
          <option value="area">Area Chart</option>
          <option value="heatmap">Heatmap</option>
          <option value="bubble">Bubble Chart</option>
          <option value="radar">Radar Chart</option>
          <option value="doughnut">Doughnut Chart</option>
          <option value="polarArea">Polar Area</option>
        </select>
      </div>

      {/* Data Series Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data Series
          </span>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {allDatasets.map((dataset) => (
            <label key={dataset.label} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={activeDatasets.includes(dataset.label)}
                onChange={() => onDatasetToggle(dataset.label)}
                className="rounded text-primary-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {dataset.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Title and Labels */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Labels & Title
          </span>
        </div>
        
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Chart Title"
            value={config.title}
            onChange={(e) => onConfigChange({ title: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="X Axis Label"
            value={config.xAxisLabel || ''}
            onChange={(e) => onConfigChange({ xAxisLabel: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Y Axis Label"
            value={config.yAxisLabel || ''}
            onChange={(e) => onConfigChange({ yAxisLabel: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Appearance
          </span>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.showLegend}
              onChange={(e) => onConfigChange({ showLegend: e.target.checked })}
              className="rounded text-primary-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Show Legend</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.showGrid}
              onChange={(e) => onConfigChange({ showGrid: e.target.checked })}
              className="rounded text-primary-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Show Grid</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.animation}
              onChange={(e) => onConfigChange({ animation: e.target.checked })}
              className="rounded text-primary-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Enable Animations</span>
          </label>
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Font Size
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {config.fontSize}px
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="24"
          value={config.fontSize}
          onChange={(e) => onConfigChange({ fontSize: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Padding */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Padding
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {config.padding}px
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="50"
          value={config.padding}
          onChange={(e) => onConfigChange({ padding: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Color Palette
        </span>
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color, index) => (
            <button
              key={color}
              onClick={() => {
                const newColors = [...config.colors];
                newColors[0] = color;
                onConfigChange({ colors: newColors });
              }}
              className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors"
              style={{ backgroundColor: color }}
              title={`Use ${color} as primary color`}
            />
          ))}
        </div>
      </div>

      {/* Responsive Settings */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Grid className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Responsive
          </span>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.responsive}
              onChange={(e) => onConfigChange({ responsive: e.target.checked })}
              className="rounded text-primary-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Responsive</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.maintainAspectRatio}
              onChange={(e) => onConfigChange({ maintainAspectRatio: e.target.checked })}
              className="rounded text-primary-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Maintain Aspect Ratio</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ChartControls; 