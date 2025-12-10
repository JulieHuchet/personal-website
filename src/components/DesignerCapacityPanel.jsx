import React, { useState } from 'react';
import { calculateDesignerWorkload, calculateUtilization, getCapacityStatus } from '../utils/capacityUtils';

const MultiSelectDropdown = ({ designers, selectedDesigners, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (designerName) => {
    const newSelection = selectedDesigners.includes(designerName)
      ? selectedDesigners.filter(name => name !== designerName)
      : [...selectedDesigners, designerName];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedDesigners.length === designers.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(designers.map(d => d.name));
    }
  };

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <span className="text-sm text-slate-700">
          {selectedDesigners.length === 0 
            ? 'Select designers to filter...' 
            : selectedDesigners.length === designers.length 
            ? 'All designers selected'
            : `${selectedDesigners.length} designer${selectedDesigners.length > 1 ? 's' : ''} selected`
          }
        </span>
        <span className="float-right">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b border-slate-200">
            <button
              onClick={handleSelectAll}
              className="w-full text-left px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
            >
              {selectedDesigners.length === designers.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          {designers.map((designer) => (
            <label key={designer.id} className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDesigners.includes(designer.name)}
                onChange={() => handleToggle(designer.name)}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700">{designer.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const CapacityBar = ({ utilization }) => {
  const status = getCapacityStatus(utilization);
  const widthPercentage = Math.min(utilization, 100);

  return (
    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${status.color}`}
        style={{ width: `${widthPercentage}%` }}
      ></div>
    </div>
  );
};

const DesignerCapacityPanel = ({ designers, initiatives, selectedDesigners, onDesignersChange }) => {
  // Filter designers if any are selected
  const displayDesigners = selectedDesigners.length > 0 
    ? designers.filter(d => selectedDesigners.includes(d.name))
    : designers;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
        👥 Designer Capacity (Q3)
      </h2>
      
      <MultiSelectDropdown
        designers={designers}
        selectedDesigners={selectedDesigners}
        onSelectionChange={onDesignersChange}
      />

      <div className="space-y-4">
        {displayDesigners.map((designer) => {
          const workload = calculateDesignerWorkload(designer.name, initiatives);
          const utilization = calculateUtilization(workload, designer.availability);
          const status = getCapacityStatus(utilization);

          return (
            <div key={designer.id} className={`${status.bgColor} border border-slate-200 rounded-lg p-4`}>
              <div className="font-semibold text-slate-900 mb-1">
                {designer.name}
              </div>
              <div className="text-sm text-slate-600 mb-2">
                Available: {designer.availability}% capacity
              </div>
              <CapacityBar utilization={utilization} />
              <div className={`text-sm font-medium ${status.textColor}`}>
                {Math.round(utilization)}% utilized
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesignerCapacityPanel;
