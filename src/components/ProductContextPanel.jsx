import React, { useState } from 'react';

const MultiSelectDropdown = ({ options, selectedValues, onSelectionChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <span className="text-sm text-slate-700">
          {selectedValues.length === 0 
            ? placeholder
            : selectedValues.length === 1
            ? selectedValues[0]
            : `${selectedValues.length} selected`
          }
        </span>
        <span className="float-right">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <label key={option} className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleToggle(option)}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductContextPanel = ({ 
  areas, 
  products, 
  productManagers, 
  productContext, 
  onProductContextChange 
}) => {
  const handleAreaChange = (area) => {
    const newContext = {
      area,
      product: '',
      pms: []
    };
    onProductContextChange(newContext);
  };

  const handleProductChange = (product) => {
    const newContext = {
      ...productContext,
      product,
      pms: []
    };
    onProductContextChange(newContext);
  };

  const handlePMsChange = (pms) => {
    const newContext = {
      ...productContext,
      pms
    };
    onProductContextChange(newContext);
  };

  const availableProducts = productContext.area ? products[productContext.area] || [] : [];
  const availablePMs = productContext.area ? productManagers[productContext.area] || [] : [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
        🎯 Product Setup
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Product Area
          </label>
          <select
            value={productContext.area}
            onChange={(e) => handleAreaChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Area</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Product
          </label>
          <select
            value={productContext.product}
            onChange={(e) => handleProductChange(e.target.value)}
            disabled={!productContext.area}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">Select Product</option>
            {availableProducts.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Product Manager(s)
          </label>
          {productContext.area ? (
            <MultiSelectDropdown
              options={availablePMs}
              selectedValues={productContext.pms}
              onSelectionChange={handlePMsChange}
              placeholder="Select PM(s)"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-slate-500 text-sm">
              Select an area first
            </div>
          )}
        </div>
      </div>

      {productContext.area && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-indigo-900 mb-2">Current Context</h4>
          <div className="text-sm text-indigo-700 space-y-1">
            <div><span className="font-medium">Area:</span> {productContext.area}</div>
            {productContext.product && (
              <div><span className="font-medium">Product:</span> {productContext.product}</div>
            )}
            {productContext.pms.length > 0 && (
              <div><span className="font-medium">PM(s):</span> {productContext.pms.join(', ')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductContextPanel;
