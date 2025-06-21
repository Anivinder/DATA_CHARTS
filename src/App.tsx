import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChartWorkspace from './components/ChartWorkspace';
import DataInput from './components/DataInput';
import { ChartData, ChartType, DataPoint } from './types';
import './App.css';

const App: React.FC = () => {
  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [allDatasets, setAllDatasets] = useState<ChartData['datasets']>([]);
  const [activeDatasets, setActiveDatasets] = useState<string[]>([]);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDataChange = (data: DataPoint[]) => {
    setRawData(data);
    if (data.length === 0) {
      setAllDatasets([]);
      setActiveDatasets([]);
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const firstRow = data[0];
    const keys = Object.keys(firstRow).filter(key => key.toLowerCase() !== 'id' && !isNaN(parseFloat(firstRow[key])));
    
    const labels = data.map((row, index) => {
      const labelKey = Object.keys(firstRow).find(key => isNaN(parseFloat(firstRow[key])));
      return row[labelKey || Object.keys(firstRow)[0]]?.toString() || `Item ${index + 1}`;
    });

    const datasets = keys.map((key, index) => ({
      label: key,
      data: data.map(row => {
        const value = row[key];
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      }),
      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      borderColor: `hsl(${(index * 137.5) % 360}, 70%, 40%)`,
      borderWidth: 2
    }));

    setAllDatasets(datasets);
    setChartData(prev => ({ ...prev, labels }));
    // By default, activate the first dataset if available
    const initialActive = datasets.length > 0 ? [datasets[0].label] : [];
    setActiveDatasets(initialActive);
  };

  useEffect(() => {
    if (rawData.length > 0) {
      const firstRow = rawData[0];
      const labels = rawData.map((row, index) => {
        const labelKey = Object.keys(firstRow).find(key => isNaN(parseFloat(firstRow[key])));
        return row[labelKey || Object.keys(firstRow)[0]]?.toString() || `Item ${index + 1}`;
      });

      const filteredDatasets = allDatasets.filter(ds => activeDatasets.includes(ds.label));
      setChartData({ labels, datasets: filteredDatasets });
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  }, [rawData, allDatasets, activeDatasets]);

  const handleChartTypeChange = (type: ChartType) => {
    setSelectedChartType(type);
  };

  const handleDatasetToggle = (label: string) => {
    setActiveDatasets(prev => 
      prev.includes(label) 
        ? prev.filter(dsLabel => dsLabel !== label)
        : [...prev, label]
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex">
        <Sidebar 
          selectedChartType={selectedChartType}
          onChartTypeChange={handleChartTypeChange}
          isOpen={isSidebarOpen}
        />
        <div className="flex-1 flex flex-col transition-all duration-300">
          <Header onMenuClick={toggleSidebar} />
          <main className="flex-1 flex flex-col overflow-hidden pt-16">
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4">
                <DataInput onDataChange={handleDataChange} />
              </div>
              <div className="flex-1 overflow-hidden">
                <ChartWorkspace 
                  data={chartData}
                  selectedChartType={selectedChartType}
                  onChartTypeChange={handleChartTypeChange}
                  allDatasets={allDatasets}
                  activeDatasets={activeDatasets}
                  onDatasetToggle={handleDatasetToggle}
                />
              </div>
            </div>
          </main>
        </div>
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            aria-hidden="true"
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App; 