import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChartType, ChartData, ChartConfig } from '../types';
import { Download, RefreshCw, Maximize2, Settings, CornerDownRight } from 'lucide-react';
import ChartRenderer from './ChartRenderer';
import ChartControls from './ChartControls';
import ExportModal from './ExportModal';

interface ChartWorkspaceProps {
  data: ChartData;
  selectedChartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  allDatasets: ChartData['datasets'];
  activeDatasets: string[];
  onDatasetToggle: (label: string) => void;
}

const ChartWorkspace: React.FC<ChartWorkspaceProps> = ({
  data,
  selectedChartType,
  onChartTypeChange,
  allDatasets,
  activeDatasets,
  onDatasetToggle,
}) => {
  const [config, setConfig] = useState<ChartConfig>({
    type: selectedChartType,
    title: 'Data Visualization',
    xAxisLabel: 'X Axis',
    yAxisLabel: 'Y Axis',
    showLegend: true,
    showGrid: true,
    responsive: true,
    maintainAspectRatio: false,
    animation: true,
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    fontSize: 14,
    padding: 20
  });

  const [showExportModal, setShowExportModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const resizableContainerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
  };

  const handleResizeMouseUp = useCallback(() => {
    isResizing.current = false;
  }, []);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current && resizableContainerRef.current) {
      const container = resizableContainerRef.current;
      const rect = container.getBoundingClientRect();
      let newWidth = e.clientX - rect.left;
      let newHeight = e.clientY - rect.top;

      // Enforce minimum dimensions
      if (newWidth < 300) newWidth = 300;
      if (newHeight < 200) newHeight = 200;

      container.style.width = `${newWidth}px`;
      container.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => handleResizeMouseMove(e);
    const mouseUpHandler = () => handleResizeMouseUp();

    if (isResizing.current) {
      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [handleResizeMouseMove, handleResizeMouseUp]);

  useEffect(() => {
    setConfig(prev => ({ ...prev, type: selectedChartType }));
  }, [selectedChartType]);

  const handleConfigChange = (newConfig: Partial<ChartConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshChart = () => {
    // Force chart re-render
    setConfig(prev => ({ ...prev }));
  };

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-800 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chart Workspace
          </h2>
          <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full">
            {selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)} Chart
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshChart}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Refresh Chart"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Export Chart"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chart Area */}
        <div className="flex-1 p-4 flex flex-col">
          <div 
            ref={resizableContainerRef}
            id="chart-container" 
            className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            style={{ width: '100%', height: '100%' }}
          >
            {data.labels.length > 0 ? (
              <ChartRenderer
                data={data}
                config={config}
                chartType={selectedChartType}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Data Available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Please upload or enter data to create a chart
                  </p>
                </div>
              </div>
            )}
             <div
              onMouseDown={handleResizeMouseDown}
              className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize bg-gray-300 dark:bg-gray-600 rounded-tl-lg flex items-center justify-center opacity-50 hover:opacity-100"
            >
              <CornerDownRight className="w-3 h-3 text-gray-600 dark:text-gray-300 transform rotate-90" />
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <ChartControls
            config={config}
            onConfigChange={handleConfigChange}
            chartType={selectedChartType}
            onChartTypeChange={onChartTypeChange}
            allDatasets={allDatasets}
            activeDatasets={activeDatasets}
            onDatasetToggle={onDatasetToggle}
          />
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          chartType={selectedChartType}
        />
      )}
    </div>
  );
};

export default ChartWorkspace; 