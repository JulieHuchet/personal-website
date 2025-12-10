import React from 'react';
import { filterInitiativesByDesigner, filterInitiativesByProduct, sizeToEffortPct } from '../utils/capacityUtils';
import { priorities, tShirtSizes } from '../data/mockData';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = priorities.find(p => p.value === priority);
  if (!priorityConfig) return null;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
      {priorityConfig.label}
    </span>
  );
};

const SizeBadge = ({ size }) => {
  const sizeConfig = tShirtSizes.find(s => s.value === size);
  if (!sizeConfig) return null;

  const colorMap = {
    'S': 'bg-green-100 text-green-800',
    'M': 'bg-yellow-100 text-yellow-800',
    'L': 'bg-orange-100 text-orange-800',
    'XL': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[size]}`}>
      {size}
    </span>
  );
};

const ReadinessBadge = ({ readiness }) => {
  const config = {
    'Y': { label: 'Ready', color: 'bg-green-100 text-green-800' },
    'N': { label: 'Not Ready', color: 'bg-red-100 text-red-800' },
    'P': { label: 'Partial', color: 'bg-yellow-100 text-yellow-800' }
  };

  const readinessConfig = config[readiness];
  if (!readinessConfig) return null;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${readinessConfig.color}`}>
      {readinessConfig.label}
    </span>
  );
};

const InitiativeCard = ({ initiative, onRemove }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 mb-1">{initiative.name}</h4>
          <div className="text-sm text-slate-600 mb-2">
            <span className="font-medium">Jira:</span> {initiative.jiraKey}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <SizeBadge size={initiative.size} />
          <PriorityBadge priority={initiative.priority} />
        </div>
      </div>
      
      <div className="text-sm text-slate-600 mb-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div><span className="font-medium">Area:</span> {initiative.area}</div>
          <div><span className="font-medium">Product:</span> {initiative.product}</div>
          <div><span className="font-medium">Designer(s):</span> {initiative.assignedDesigners.join(', ')}</div>
          <div><span className="font-medium">Effort:</span> {sizeToEffortPct(initiative.size)}%</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <ReadinessBadge readiness={initiative.designReadiness} />
        <button
          onClick={() => onRemove(initiative.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const CurrentInitiativesPanel = ({ 
  initiatives, 
  selectedDesigners, 
  selectedProduct, 
  viewMode, 
  onViewModeChange, 
  onRemoveInitiative 
}) => {
  // Filter initiatives based on view mode
  let filteredInitiatives = initiatives;
  
  if (viewMode === 'designer' && selectedDesigners.length > 0) {
    filteredInitiatives = filterInitiativesByDesigner(initiatives, selectedDesigners);
  } else if (viewMode === 'product' && selectedProduct) {
    filteredInitiatives = filterInitiativesByProduct(initiatives, selectedProduct);
  }

  const showEmptyState = (viewMode === 'designer' && selectedDesigners.length === 0) ||
                         (viewMode === 'product' && !selectedProduct) ||
                         filteredInitiatives.length === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          📋 Current Initiatives (Q3)
        </h2>
        
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('designer')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'designer' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Designer
          </button>
          <button
            onClick={() => onViewModeChange('product')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'product' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Product
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {showEmptyState ? (
          <div className="text-center py-8 text-slate-500">
            {viewMode === 'designer' && selectedDesigners.length === 0 && (
              <p>Select designers to view their initiatives</p>
            )}
            {viewMode === 'product' && !selectedProduct && (
              <p>Select a product to view its initiatives</p>
            )}
            {filteredInitiatives.length === 0 && (
              ((viewMode === 'designer' && selectedDesigners.length > 0) || 
               (viewMode === 'product' && selectedProduct)) && (
                <p>No initiatives found for the selected filter</p>
              )
            )}
          </div>
        ) : (
          <div>
            {filteredInitiatives.map((initiative) => (
              <InitiativeCard
                key={initiative.id}
                initiative={initiative}
                onRemove={onRemoveInitiative}
              />
            ))}
          </div>
        )}
      </div>

      {filteredInitiatives.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            <span className="font-medium">Total:</span> {filteredInitiatives.length} initiative{filteredInitiatives.length !== 1 ? 's' : ''}
            <span className="ml-4 font-medium">Total Effort:</span> {
              filteredInitiatives.reduce((sum, init) => sum + sizeToEffortPct(init.size), 0)
            }%
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentInitiativesPanel;
