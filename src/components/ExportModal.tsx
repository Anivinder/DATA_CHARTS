import React, { useState } from 'react';
import { X, Download, Image, FileText, File } from 'lucide-react';
import { ChartType, ExportOptions } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface ExportModalProps {
  onClose: () => void;
  chartType: ChartType;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, chartType }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 1,
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff'
  });

  const handleExport = async () => {
    const chartElement = document.getElementById('chart-container');
    if (!chartElement) {
      toast.error('Chart element not found for export.');
      return;
    }

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: exportOptions.backgroundColor,
        width: exportOptions.width,
        height: exportOptions.height,
        scale: exportOptions.quality
      });

      switch (exportOptions.format) {
        case 'png':
        case 'jpg':
          const link = document.createElement('a');
          link.download = `chart.${exportOptions.format}`;
          link.href = canvas.toDataURL(`image/${exportOptions.format}`, exportOptions.quality);
          link.click();
          break;
        
        case 'pdf':
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape', 'mm', 'a4');
          const imgWidth = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('chart.pdf');
          break;
        
        case 'svg':
          // For SVG export, we would need to convert the canvas to SVG
          // This is a simplified version
          const svgData = canvas.toDataURL('image/svg+xml');
          const svgLink = document.createElement('a');
          svgLink.download = 'chart.svg';
          svgLink.href = svgData;
          svgLink.click();
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. See console for details.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Export Chart
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { format: 'png', label: 'PNG', icon: Image },
                { format: 'jpg', label: 'JPG', icon: Image },
                { format: 'pdf', label: 'PDF', icon: FileText },
                { format: 'svg', label: 'SVG', icon: File }
              ].map(({ format, label, icon: Icon }) => (
                <button
                  key={format}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: format as any }))}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                    exportOptions.format === format
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quality
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(exportOptions.quality * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={exportOptions.quality}
              onChange={(e) => setExportOptions(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Width (px)
              </label>
              <input
                type="number"
                value={exportOptions.width}
                onChange={(e) => setExportOptions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                className="input-field"
                min="100"
                max="3000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Height (px)
              </label>
              <input
                type="number"
                value={exportOptions.height}
                onChange={(e) => setExportOptions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                className="input-field"
                min="100"
                max="3000"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={exportOptions.backgroundColor}
                onChange={(e) => setExportOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={exportOptions.backgroundColor}
                onChange={(e) => setExportOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="flex-1 input-field"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 