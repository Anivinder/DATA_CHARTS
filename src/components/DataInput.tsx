import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, Table, Plus, Eye } from 'lucide-react';
import { DataPoint } from '../types';
import toast from 'react-hot-toast';

interface DataInputProps {
  onDataChange: (data: DataPoint[]) => void;
}

const DataInput: React.FC<DataInputProps> = ({ onDataChange }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [manualData, setManualData] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.csv')) {
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              const parsedData = results.data as DataPoint[];
              setData(parsedData);
              onDataChange(parsedData);
              toast.success('CSV file uploaded successfully!');
            },
            error: (error: any) => {
              toast.error('Error parsing CSV file');
              console.error('CSV parsing error:', error);
            }
          });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as DataPoint[];
          setData(jsonData);
          onDataChange(jsonData);
          toast.success('Excel file uploaded successfully!');
        }
      } catch (error) {
        toast.error('Error reading file');
        console.error('File reading error:', error);
      }
    };
    
    if (file.name.endsWith('.csv')) {
      // PapaParse can handle the file directly
    } else {
      reader.readAsBinaryString(file);
    }
  }, [onDataChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleManualDataSubmit = () => {
    try {
      const parsedData = JSON.parse(manualData);
      if (Array.isArray(parsedData)) {
        setData(parsedData);
        onDataChange(parsedData);
        toast.success('Manual data applied successfully!');
      } else {
        toast.error('Data must be an array of objects');
      }
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  };

  const addSampleData = () => {
    const sampleData: DataPoint[] = [
      { month: 'Jan', sales: 12, revenue: 8 },
      { month: 'Feb', sales: 19, revenue: 15 },
      { month: 'Mar', sales: 3, revenue: 7 },
      { month: 'Apr', sales: 5, revenue: 12 },
      { month: 'May', sales: 2, revenue: 9 },
      { month: 'Jun', sales: 3, revenue: 14 },
    ];
    onDataChange(sampleData);
    toast.success('Sample data loaded!');
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Data Input
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(false)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !previewMode
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Input
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              previewMode
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-1" />
            Preview
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {!previewMode ? (
          <>
            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                Upload Data
              </h3>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isDragActive
                    ? 'Drop the file here...'
                    : 'Drag & drop a CSV or Excel file, or click to select'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Supports .csv, .xlsx, .xls
                </p>
              </div>
            </div>

            {/* Manual Data Entry */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                Manual Data Entry
              </h3>
              <textarea
                value={manualData}
                onChange={(e) => setManualData(e.target.value)}
                placeholder="Enter JSON data here..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleManualDataSubmit}
                className="btn-primary w-full"
              >
                Apply Data
              </button>
            </div>

            {/* Sample Data */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                Quick Start
              </h3>
              <button
                onClick={addSampleData}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Load Sample Data</span>
              </button>
            </div>
          </>
        ) : (
          /* Data Preview */
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Data Preview
            </h3>
            {data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="py-2 px-3 text-gray-600 dark:text-gray-400">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 10 && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                    Showing first 10 rows of {data.length} total rows
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Table className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
                <p className="text-sm">Upload a file or enter data manually</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataInput; 