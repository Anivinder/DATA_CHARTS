import React, { useState } from 'react';
import { ChartType } from '../types';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  ScatterChart, 
  AreaChart, 
  Grid3X3,
  Circle,
  Radar,
  Donut,
  Settings,
  Palette,
  Grid
} from 'lucide-react';

interface SidebarProps {
  selectedChartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  isOpen: boolean;
}

const chartTypes = [
  { type: 'bar' as ChartType, label: 'Bar Chart', icon: BarChart3 },
  { type: 'line' as ChartType, label: 'Line Chart', icon: LineChart },
  { type: 'pie' as ChartType, label: 'Pie Chart', icon: PieChart },
  { type: 'scatter' as ChartType, label: 'Scatter Plot', icon: ScatterChart },
  { type: 'area' as ChartType, label: 'Area Chart', icon: AreaChart },
  { type: 'heatmap' as ChartType, label: 'Heatmap', icon: Grid3X3 },
  { type: 'bubble' as ChartType, label: 'Bubble Chart', icon: Circle },
  { type: 'radar' as ChartType, label: 'Radar Chart', icon: Radar },
  { type: 'doughnut' as ChartType, label: 'Doughnut Chart', icon: Donut },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedChartType, onChartTypeChange, isOpen }) => {
  const [activeTab, setActiveTab] = useState<'charts' | 'settings'>('charts');

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0`}
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 pt-16">
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'charts'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Charts
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'charts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chart Types
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {chartTypes.map((chart) => {
                const Icon = chart.icon;
                const isSelected = selectedChartType === chart.type;
                
                return (
                  <button
                    key={chart.type}
                    onClick={() => onChartTypeChange(chart.type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium text-center">
                        {chart.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chart Settings
            </h3>
            
            {/* Appearance Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Appearance
                </span>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Show Legend</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Show Grid</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Enable Animations</span>
                </label>
              </div>
            </div>

            {/* Data Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Grid className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Options
                </span>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Real-time Updates</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Drill-down Enabled</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 